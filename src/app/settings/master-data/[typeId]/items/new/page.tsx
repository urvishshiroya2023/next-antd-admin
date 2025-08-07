"use client";

import { useParams } from 'next/navigation';
import MasterItemForm from '../../../../../../components/MasterItemForm';

export default function NewMasterItemPage() {
  const params = useParams();
  const { typeId } = params;
  
  return (
    <MasterItemForm 
      masterTypeId={typeId as string}
    />
  );
}
