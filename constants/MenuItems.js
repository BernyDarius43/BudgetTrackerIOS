// utils/menuItems.js
import { dashboard, expenses, transactions, trend } from './Icons';

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: 'Dashboard' // route name for React Navigation
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: 'Transactions',
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: 'Income',
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: 'Expense',
    },
];
