"use client";

import { useParams } from 'next/navigation';
import MasterItemForm from '../../../../components/MasterItemForm';

export default function NewMasterSubItemPage() {
  const params = useParams();
  const { typeId, parentId } = params;
  
  return (
    <MasterItemForm 
      masterTypeId={typeId as string}
      parentItemId={parentId as string}
    />
  );
}
