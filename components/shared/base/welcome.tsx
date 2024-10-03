import React from 'react';
import Container from './container';

interface WelcomeProps {
  title: string;
  description: string;
}

const Welcome: React.FC<WelcomeProps> = ({ title, description }) => {
  return (
    <Container>
      <div>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </Container>
  );
};

export default Welcome;