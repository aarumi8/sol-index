import React from 'react';
import Container from './container';
import { Title } from './title';

interface WelcomeProps {
    title: string;
    description: string;
}

const Welcome: React.FC<WelcomeProps> = ({ title, description }) => {
    return (
        <Container>
            <div>
                <Title text={title} className="font-extrabold mb-4" />
                <p className="text-gray-600">{description}</p>
            </div>
        </Container>
    );
};

export default Welcome;