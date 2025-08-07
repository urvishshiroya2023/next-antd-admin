"use client";

import { useParams } from 'next/navigation';
import MasterItemList from '../../../components/MasterItemList';

export default function MasterSubItemsPage() {
  const params = useParams();
  const { typeId, parentId } = params;
  
  return (
    <MasterItemList 
      masterTypeId={typeId as string}
      parentItem={{ id: parentId as string, name: 'Parent Item' }} // We'll update this with actual data later
    />
  );
}
