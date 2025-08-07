"use client";

import { useParams } from 'next/navigation';
import MasterItemForm from '../../../../../components/MasterItemForm';

export default function EditMasterSubItemPage() {
  const params = useParams();
  const { typeId, parentId, itemId } = params;
  
  return (
    <MasterItemForm 
      masterTypeId={typeId as string}
      parentItemId={parentId as string}
      itemId={itemId as string}
      isEdit={true}
    />
  );
}
