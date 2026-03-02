import models
from sqlalchemy.orm import Session
from models import Visit
from datetime import date


def create_visit(db: Session, data: dict, label, prob, override):

    visit = Visit(
        AGE=data["AGE"],
        SEX=data["SEX"],
        TEMPF=data["TEMPF"],
        PULSE=data["PULSE"],
        RESPR=data["RESPR"],
        BPSYS=data["BPSYS"],
        BPDIAS=data["BPDIAS"],
        PAINSCALE=data["PAINSCALE"],
        ARREMS=data["ARREMS"],
        AMBTRANSFER=data["AMBTRANSFER"],
        INJURY=data["INJURY"],
        RFV1=data["RFV1"],
        RFV2=data["RFV2"],
        RFV3=data["RFV3"],
        RFV_TEXT_ALL=data["RFV_TEXT_ALL"],
        classification=label,
        risk_probability=prob,
        override_triggered=override,
        status="OPEN"
    )

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit

def create_prescription(db, prescription_data):
    days = (prescription_data["end_date"] - prescription_data["start_date"]).days + 1
    total_tablets = days * prescription_data["dosage_per_day"] * prescription_data["tablets_per_dose"]

    db_prescription = models.Prescription(
        visit_id=prescription_data["visit_id"],
        medicine_name=prescription_data["medicine_name"],
        dosage_per_day=prescription_data["dosage_per_day"],
        tablets_per_dose=prescription_data["tablets_per_dose"],
        start_date=prescription_data["start_date"],
        end_date=prescription_data["end_date"],
        total_tablets=total_tablets,
        remarks=prescription_data.get("remarks"),
        status="ACTIVE"
    )

    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


def get_prescriptions_by_visit(db, visit_id: int):
    prescriptions = db.query(models.Prescription).filter(
        models.Prescription.visit_id == visit_id
    ).all()

    today = date.today()

    for p in prescriptions:
        if p.status != "DISCONTINUED" and today > p.end_date:
            p.status = "DISCONTINUED"

    return prescriptions


def discontinue_prescription(db, prescription_id: int):
    prescription = db.query(models.Prescription).filter(
        models.Prescription.id == prescription_id
    ).first()

    if prescription:
        prescription.status = "DISCONTINUED"
        db.commit()
        db.refresh(prescription)

    return prescription