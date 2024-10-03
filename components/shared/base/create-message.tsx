import React from 'react';
import Container from './container';

interface Props {
  title: string;
  description: string;
  className?: string;
}

const CreateMessage: React.FC<Props> = ({ title, description, className }) => {
  return (
    <Container className={className}>
      <div>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </Container>
  );
};

export default CreateMessage;