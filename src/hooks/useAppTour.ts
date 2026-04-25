import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const useAppTour = () => {
    const t = useTranslations('tour');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const startTour = () => {
        if (!isClient) return;
        const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: t('next'),
            prevBtnText: t('prev'),
            doneBtnText: t('done'),
            progressText: '{{current}} / {{total}}',
            steps: [
                { popover: { title: t('welcomeTitle'), description: t('welcomeDesc'), side: "over", align: 'start' } },
                { element: '#tour-sidebar', popover: { title: t('sidebarTitle'), description: t('sidebarDesc'), side: "right", align: 'start' } },
                { element: '#tour-user-controls', popover: { title: t('controlsTitle'), description: t('controlsDesc'), side: "bottom", align: 'start' } },
                { element: '#tour-summary', popover: { title: t('summaryTitle'), description: t('summaryDesc'), side: "bottom", align: 'start' } },
                { element: '#tour-portfolio', popover: { title: t('portfolioTitle'), description: t('portfolioDesc'), side: "top", align: 'start' } },
                { element: '#tour-expenses', popover: { title: t('expensesTitle'), description: t('expensesDesc'), side: "top", align: 'start' } },
                { element: '#tour-budget', popover: { title: t('budgetTitle'), description: t('budgetDesc'), side: "top", align: 'start' } },
                { element: '#tour-goals', popover: { title: t('goalsTitle'), description: t('goalsDesc'), side: "top", align: 'start' } },
            ]
        });
        driverObj.drive();
    };

    return { startTour };
};
