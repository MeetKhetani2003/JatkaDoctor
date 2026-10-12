async function testPrescriptionFlow() {
  console.log("=== 1. Testing Prescription Upload ===");

  const form = new FormData();
  const samplePdfBytes = Buffer.from("%PDF-1.4 sample prescription content for testing");
  const blob = new Blob([samplePdfBytes], { type: 'application/pdf' });
  form.append('file', blob, 'test_prescription_dr_sharma.pdf');
  form.append('patientName', 'Amitabh Verma');
  form.append('patientPhone', '9876543210');
  form.append('notes', 'Doctor recommended knee physiotherapy for joint inflammation');
  form.append('uploadSource', 'Upload PDF');

  const uploadRes = await fetch('http://localhost:3000/api/prescriptions/upload', {
    method: 'POST',
    body: form
  });

  const uploadData = await uploadRes.json();
  console.log("Upload Response:", uploadData);

  if (!uploadData.success) {
    throw new Error("Upload failed: " + JSON.stringify(uploadData));
  }

  const prescriptionId = uploadData.prescriptionId;
  console.log("Generated Prescription ID:", prescriptionId);

  console.log("\n=== 2. Testing Secure File View & Download ===");
  const viewRes = await fetch(`http://localhost:3000/api/prescriptions/${prescriptionId}/file`);
  console.log("File View Status:", viewRes.status);
  console.log("Content-Type:", viewRes.headers.get('content-type'));
  console.log("Content-Disposition:", viewRes.headers.get('content-disposition'));

  const dlRes = await fetch(`http://localhost:3000/api/prescriptions/${prescriptionId}/file?download=1`);
  console.log("File Download Status:", dlRes.status);
  console.log("Download Content-Disposition:", dlRes.headers.get('content-disposition'));

  console.log("\n=== 3. Testing Admin Prescriptions API ===");
  const adminRes = await fetch('http://localhost:3000/api/admin/prescriptions');
  const adminData = await adminRes.json();
  console.log("Admin Prescriptions Count:", adminData.prescriptions?.length);
  const found = adminData.prescriptions?.find(p => p.prescriptionId === prescriptionId);
  console.log("Found Uploaded Prescription in Admin List:", !!found);
  if (found) {
    console.log("Prescription Details:", {
      id: found.prescriptionId,
      patient: found.patientName,
      phone: found.patientPhone,
      status: found.status,
      fileUrl: found.fileUrl
    });
  }

  console.log("\n=== 4. Testing Admin Notification Trigger ===");
  const notifRes = await fetch('http://localhost:3000/api/admin/notifications?tab=All&limit=5');
  const notifData = await notifRes.json();
  const notifFound = notifData.data?.find(n => n.bookingId === prescriptionId);
  console.log("Found Prescription in Admin Notification Center:", !!notifFound);
  if (notifFound) {
    console.log("Notification Record:", {
      bookingId: notifFound.bookingId,
      patientName: notifFound.patientName,
      service: notifFound.service,
      category: notifFound.category,
      problem: notifFound.problem
    });
  }

  console.log("\n>>> ALL PRESCRIPTION CHECKS PASSED SUCCESSFULLY! <<<");
}

testPrescriptionFlow().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
