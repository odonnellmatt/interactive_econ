import React from 'react';

const Glossary: React.FC = () => {
    const terms = [
        {
            term: 'Demand',
            definition: 'The relationship between the price of a good and the quantity that consumers are willing and able to purchase. Represented by a downward-sloping curve.',
        },
        {
            term: 'Supply',
            definition: 'The relationship between the price of a good and the quantity that producers are willing and able to sell. Represented by an upward-sloping curve.',
        },
        {
            term: 'Equilibrium Price',
            definition: 'The price at which the quantity demanded by consumers equals the quantity supplied by producers. The market clears at this price.',
        },
        {
            term: 'Equilibrium Quantity',
            definition: 'The quantity bought and sold at the equilibrium price.',
        },
        {
            term: 'Price Ceiling',
            definition: 'A legal maximum on the price at which a good can be sold. If it is set below the equilibrium price, it is binding and causes a shortage.',
        },
        {
            term: 'Price Floor',
            definition: 'A legal minimum on the price at which a good can be sold. If it is set above the equilibrium price, it is binding and causes a surplus.',
        },
        {
            term: 'Shortage',
            definition: 'A situation in which the quantity demanded is greater than the quantity supplied. Often occurs due to a binding price ceiling.',
        },
        {
            term: 'Surplus (Market)',
            definition: 'A situation in which the quantity supplied is greater than the quantity demanded. Often occurs due to a binding price floor.',
        },
        {
            term: 'Consumer Surplus',
            definition: 'The difference between the maximum amount consumers are willing to pay for a good and the price they actually pay. It measures consumer welfare.',
        },
        {
            term: 'Producer Surplus',
            definition: 'The difference between the price producers receive for a good and their cost of producing it. It measures producer welfare.',
        },
        {
            term: 'Deadweight Loss',
            definition: 'The fall in total surplus that results from a market distortion, such as a tax, tariff, or price control. It represents missed opportunities for mutually beneficial trades.',
        },
        {
            term: 'Tax Incidence',
            definition: 'The manner in which the burden of a tax is shared among participants in a market. The less elastic side of the market bears a larger share of the burden.',
        },
        {
            term: 'Elasticity',
            definition: 'A measure of the responsiveness of quantity demanded or quantity supplied to a change in price (or another determinant).',
        },
        {
            term: 'World Price',
            definition: 'The price of a good that prevails in the world market for that good.',
        },
        {
            term: 'Tariff',
            definition: 'A tax on goods produced abroad and sold domestically. It raises the domestic price above the world price, reducing imports and creating a deadweight loss.',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Glossary of Economic Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {terms.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-indigo-700 mb-2">{item.term}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Glossary;
