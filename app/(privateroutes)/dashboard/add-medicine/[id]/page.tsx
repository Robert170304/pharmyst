"use client";

import MedicineForm from "@/components/medicine-form";
import { useParams } from "next/navigation";

export default function EditMedicinePage() {
  const { id } = useParams();
  const medicineId = Array.isArray(id) ? id[0] : id;
  return <MedicineForm id={medicineId} />;
}
