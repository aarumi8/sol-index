import React from 'react';
import { Button } from "@/components/ui/button";
import Container from './container';
import Link from 'next/link';
import { Title } from './title';

interface CreateIndexProps {
    title: string;
    description: string;
}

const CreateIndex: React.FC<CreateIndexProps> = ({ title, description }) => {
    return (
        <Container>
            <div>
                <Title text={title} className="font-extrabold mb-4" />
                <p className="text-gray-600 mb-6">{description}</p>
            </div>
            <Link href="/create">
                <Button>Create Index</Button>
            </Link>
        </Container>
    );
};

export default CreateIndex;