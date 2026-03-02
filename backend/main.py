from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Patient, Visit, Prediction
from schemas import PatientCreate, VisitCreate, PredictionResponse
from ml import predict
import schemas
import crud

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# CREATE PATIENT
# ==============================

@app.post("/patients")
def create_patient(request: PatientCreate, db: Session = Depends(get_db)):

    patient = Patient(**request.dict())

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


# ==============================
# GET PATIENT
# ==============================

@app.get("/patients/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


# ==============================
# CREATE VISIT
# ==============================

@app.post("/visits")
def create_visit(request: VisitCreate, db: Session = Depends(get_db)):

    visit = Visit(**request.dict())

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


# ==============================
# GET VISIT
# ==============================

@app.get("/visits/{visit_id}")
def get_visit(visit_id: int, db: Session = Depends(get_db)):

    visit = db.query(Visit).filter(Visit.id == visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    return visit

# ==============================
# GET ALL VISITS
# ==============================

@app.get("/visits")
def get_all_visits(db: Session = Depends(get_db)):
    visits = db.query(Visit).all()

    result = []

    for v in visits:
        latest_prediction = (
            db.query(Prediction)
            .filter(Prediction.visit_id == v.id)
            .order_by(Prediction.id.desc())
            .first()
        )

        result.append({
            "id": v.id,
            "patient_name": v.patient.full_name,
            "temperature": v.temperature,
            "pulse": v.pulse,
            "systolic_bp": v.systolic_bp,
            "diastolic_bp": v.diastolic_bp,
            "rfv_text": v.rfv_text,
            "status": v.status,
            "classification": latest_prediction.classification if latest_prediction else None,
            "risk_probability": latest_prediction.risk_probability if latest_prediction else None,
        })

    return result

# ==============================
# RUN TRIAGE
# ==============================

@app.post("/triage/{visit_id}", response_model=PredictionResponse)
def run_triage(visit_id: int, db: Session = Depends(get_db)):

    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    patient = db.query(Patient).filter(Patient.id == visit.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # ----------------------
    # Map DB → ML input
    # ----------------------

    ml_input = {
        "AGE": patient.age,
        "SEX": 1 if patient.gender.lower() == "male" else 2,
        "TEMPF": visit.temperature,
        "PULSE": visit.pulse,
        "RESPR": visit.respiration,
        "BPSYS": visit.systolic_bp,
        "BPDIAS": visit.diastolic_bp,
        "PAINSCALE": visit.pain_scale,
        "ARREMS": 1 if visit.arrival_mode == "Ambulance" else 0,
        "AMBTRANSFER": 1 if visit.ambtransfer else 0,
        "INJURY": visit.injury,
        "RFV1": visit.rfv1,
        "RFV2": visit.rfv2,
        "RFV3": visit.rfv3,
        "RFV_TEXT_ALL": visit.rfv_text
    }

    label, prob, override = predict(ml_input)

    prediction = Prediction(
        visit_id=visit.id,
        classification=label,
        risk_probability=prob,
        override_triggered=override
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return {
        "visit_id": visit.id,
        "classification": label,
        "risk_probability": prob,
        "override_triggered": override
    }


# ==============================
# GET PREDICTIONS FOR VISIT
# ==============================

@app.get("/predictions/{visit_id}")
def get_predictions(visit_id: int, db: Session = Depends(get_db)):

    preds = db.query(Prediction).filter(Prediction.visit_id == visit_id).all()

    return preds

# ==============================
# DOCTOR OVERRIDE
# ==============================

@app.put("/override/{visit_id}")
def override_prediction(visit_id: int, db: Session = Depends(get_db)):

    latest_prediction = (
        db.query(Prediction)
        .filter(Prediction.visit_id == visit_id)
        .order_by(Prediction.id.desc())
        .first()
    )

    if not latest_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    # If currently escalated → revert
    if latest_prediction.override_triggered:

        if latest_prediction.original_classification:
            latest_prediction.classification = latest_prediction.original_classification

        latest_prediction.override_triggered = False

    else:
        # Only escalate if not already critical
        if latest_prediction.classification != "Critical":

            # Save original ONLY if not already saved
            if not latest_prediction.original_classification:
                latest_prediction.original_classification = latest_prediction.classification

            latest_prediction.classification = "Critical"
            latest_prediction.override_triggered = True

    db.commit()
    db.refresh(latest_prediction)

    return {
        "visit_id": visit_id,
        "new_classification": latest_prediction.classification
    }
# ==============================
# Prescriptions
# ==============================

@app.post("/prescriptions", response_model=schemas.PrescriptionResponse)
def add_prescription(prescription: schemas.PrescriptionCreate, db: Session = Depends(get_db)):
    return crud.create_prescription(db, prescription.dict())


@app.get("/prescriptions/{visit_id}", response_model=list[schemas.PrescriptionResponse])
def fetch_prescriptions(visit_id: int, db: Session = Depends(get_db)):
    return crud.get_prescriptions_by_visit(db, visit_id)


@app.put("/prescriptions/discontinue/{prescription_id}", response_model=schemas.PrescriptionResponse)
def discontinue(prescription_id: int, db: Session = Depends(get_db)):
    return crud.discontinue_prescription(db, prescription_id)