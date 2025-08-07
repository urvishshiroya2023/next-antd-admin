"use client";

import { useParams } from 'next/navigation';
import MasterItemList from '../../components/MasterItemList';

export default function MasterItemsPage() {
  const params = useParams();
  const { typeId } = params;
  
  return (
    <MasterItemList 
      masterTypeId={typeId as string} 
    />
  );
}
