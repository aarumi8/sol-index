import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Title } from "./title";
import { BuyModal } from "../modals/buy-modal";
import { SellModal } from "../modals/sell-modal";
import { RedeemModal } from "../modals/redeem-modal";

interface Props {
    title: string;
    titleBtn: string;
}

const IndexAction: React.FC<Props> = ({ title, titleBtn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = (value: string) => {
        console.log(`Confirmed ${titleBtn} with value: ${value}`);
        // Add your logic here to handle the confirmation
    };

    const renderModal = () => {
        switch (titleBtn.toLowerCase()) {
            case 'buy':
                return <BuyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />;
            case 'sell':
                return <SellModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />;
            case 'redeem':
                return <RedeemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <Title text={title} size="xs" className="text-gray-600" />
            <Button size="lg" onClick={() => setIsModalOpen(true)}>{titleBtn}</Button>
            {renderModal()}
        </div>
    );
}

export default IndexAction;