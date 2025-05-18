import PDFDocument from "pdfkit";

export default function generateReceiptPDF(session) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text("Mentorship Session Receipt", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Session ID: ${session._id}`);
    doc.text(`Mentor: ${session.mentor?.name}`);
    doc.text(`Mentee: ${session.menteeName}`);
    doc.text(`Topic: ${session.topic}`);
    doc.text(`Date: ${new Date(session.date).toLocaleString()}`);
    doc.text(`Duration: ${session.duration} minutes`);
    doc.text(`Status: ${session.status}`);

    doc.end();
  });
}
