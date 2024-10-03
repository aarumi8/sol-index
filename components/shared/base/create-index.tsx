import React from 'react';
import { Button } from "@/components/ui/button";
import Container from './container';

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
      <Button>Create Index</Button>
    </Container>
  );
};

export default CreateIndex;