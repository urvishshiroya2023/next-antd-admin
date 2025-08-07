"use client";

import { useParams } from 'next/navigation';
import MasterItemForm from '../../../../components/MasterItemForm';

export default function EditMasterItemPage() {
  const params = useParams();
  const { typeId, itemId } = params;
  
  return (
    <MasterItemForm 
      masterTypeId={typeId as string}
      itemId={itemId as string}
      isEdit={true}
    />
  );
}
