import React from 'react';
import Link from 'next/link';
import { getClassData } from '../../actions/dataActions';
import ClassItem from '../../components/ClassItem';
import AllStudentsReportPDF from '../../components/AllStudentsReportPDF';

export default async function ClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const classItem = await getClassData(params.id);

  if (!classItem) {
    return <div>Class not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Class Details</h1>
      <ClassItem classItem={classItem} />
      <div className="mt-8">
        <AllStudentsReportPDF classItem={classItem} />
      </div>
    </div>
  );
}
