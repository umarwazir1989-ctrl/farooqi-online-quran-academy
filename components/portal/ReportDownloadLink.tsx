"use client";

export default function ReportDownloadLink({ reportId }: { reportId: string }) {
  return (
    <a className="table-action" href={`/api/reports/${reportId}/pdf`}>
      Download PDF
    </a>
  );
}
