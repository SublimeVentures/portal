export const offersFilters = [
    {
        id: 'only-me',
        name: 'Only mine',
        filter: { maker: '' },
    },
    {
        id: 'only-buy',
        name: 'Only buy',
        filter: { isSell: false },
    },
    {
        id: 'only-sell',
        name: 'Only sell',
        filter: { isSell: true },
    },
];
