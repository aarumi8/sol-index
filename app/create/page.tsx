import Container from "@/components/shared/base/container";
import CreateMessage from "@/components/shared/base/create-message";
import CreateIndexForm from "@/components/shared/forms/create-index-form";
import React from "react";

interface Props {
    className?: string;
}

const CreatePage: React.FC<Props> = ({ className }) => {
    return (
        <div className={className}>
            <CreateMessage
                className="mb-4"
                title="Create Index"
                description="Start creating your custom index now. Define your criteria and watch your index come to life."
            />

            <Container>
                <CreateIndexForm />
            </Container>
        </div>
    )
}

export default CreatePage;