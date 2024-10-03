import React from 'react';
import { Button } from "@/components/ui/button";
import Container from './container';
import Link from 'next/link';

interface CreateIndexProps {
  title: string;
  description: string;
}

const CreateIndex: React.FC<CreateIndexProps> = ({ title, description }) => {
  return (
    <Container>
      <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      <Link href="/create">
        <Button>Create Index</Button>
      </Link>
    </Container>
  );
};

export default CreateIndex;