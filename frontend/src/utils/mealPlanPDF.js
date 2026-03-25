import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and download a styled PDF for the weekly meal plan.
 * @param {Object} formData - The user's form data
 * @param {Array} generatedPlan - The generated weekly plan array
 */
export const downloadMealPlanAsPDF = (formData, generatedPlan) => {
    if (!generatedPlan || generatedPlan.length === 0) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PAGE_W = 210;
    const MARGIN = 15;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    // ------ Helpers ------
    const addPageIfNeeded = (neededY) => {
        if (neededY > 270) {
            doc.addPage();
            return MARGIN;
        }
        return neededY;
    };

    // ------ COVER / HEADER ------
    // Gradient top bar (simulate with a rectangle)
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, PAGE_W, 38, 'F');
    doc.setFillColor(59, 130, 246); // blue-500
    doc.rect(PAGE_W / 2, 0, PAGE_W / 2, 38, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('FitVision AI', MARGIN, 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI Powered Meal Plan', MARGIN, 23);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, PAGE_W - MARGIN, 23, { align: 'right' });

    // ------ USER SUMMARY CARD ------
    let y = 46;
    doc.setFillColor(245, 250, 247);
    doc.roundedRect(MARGIN, y, CONTENT_W, 30, 3, 3, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN, y, CONTENT_W, 30, 3, 3, 'S');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    const userName = formData.name ? `${formData.name}'s Plan` : 'Your Personalized Plan';
    doc.text(userName, MARGIN + 5, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);

    const goalLabel = (formData.goal || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const dietLabel = formData.dietaryPreferences?.vegetarian ? 'Vegetarian' : 'Non-Vegetarian';

    const summaryItems = [
        `Goal: ${goalLabel}`,
        `Calories: ${formData.calorieTarget} kcal/day`,
        `Diet: ${dietLabel}`,
        formData.age ? `Age: ${formData.age} yrs` : '',
        formData.gender ? `Gender: ${formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}` : '',
        formData.weight ? `Weight: ${formData.weight} kg` : '',
        formData.height ? `Height: ${formData.height} cm` : '',
    ].filter(Boolean);

    const colW = CONTENT_W / 4;
    summaryItems.forEach((item, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        doc.text(item, MARGIN + 5 + col * colW, y + 18 + row * 7);
    });

    y += 36;

    // ------ OVERVIEW TABLE ------
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Meal Plan Overview', MARGIN, y + 6);
    y += 10;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: [['Day', 'Date', 'Total Calories', 'Protein', 'Carbs', 'Fat', 'Est. Cost (Rs.)']],
        body: generatedPlan.map(day => [
            day.day.split(' - ')[1] || day.day,
            day.date,
            `${day.totals.calories} kcal`,
            day.totals.protein,
            day.totals.carbs,
            day.totals.fat,
            `Rs. ${day.totals.estimatedCost}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        columnStyles: { 0: { fontStyle: 'bold' } }
    });

    y = doc.lastAutoTable.finalY + 10;

    // ------ DAILY PLANS ------
    generatedPlan.forEach((dayPlan, dayIdx) => {
        y = addPageIfNeeded(y + 10);

        // Day Header
        doc.setFillColor(16, 185, 129);
        doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(dayPlan.day, MARGIN + 3, y + 5.5);
        doc.text(dayPlan.date, PAGE_W - MARGIN - 3, y + 5.5, { align: 'right' });
        y += 10;

        // Meals table for this day
        autoTable(doc, {
            startY: y,
            margin: { left: MARGIN, right: MARGIN },
            head: [['Meal', 'Dish', 'Calories', 'Protein', 'Carbs', 'Fat', 'Ingredients']],
            body: dayPlan.meals.map(meal => [
                meal.name,
                meal.title,
                `${meal.calories} kcal`,
                meal.macros.protein,
                meal.macros.carbs,
                meal.macros.fat,
                meal.ingredients.join(', ')
            ]),
            theme: 'grid',
            headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            bodyStyles: { fontSize: 7.5, textColor: [30, 30, 30] },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 20 },
                1: { cellWidth: 38 },
                2: { cellWidth: 22, halign: 'center' },
                3: { cellWidth: 16, halign: 'center' },
                4: { cellWidth: 16, halign: 'center' },
                5: { cellWidth: 16, halign: 'center' },
                6: { cellWidth: 'auto' }
            }
        });

        // Daily totals bar
        const ft = doc.lastAutoTable.finalY;
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.3);
        doc.rect(MARGIN, ft + 1, CONTENT_W, 7, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(5, 122, 85);
        doc.text(
            `Daily Total: ${dayPlan.totals.calories} kcal  |  P: ${dayPlan.totals.protein}  |  C: ${dayPlan.totals.carbs}  |  F: ${dayPlan.totals.fat}  |  Est. Cost: Rs. ${dayPlan.totals.estimatedCost}`,
            MARGIN + 3, ft + 5.5
        );

        y = ft + 12;
    });

    // ------ FOOTER on each page ------
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, 287, PAGE_W - MARGIN, 287);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('FitVision AI — AI Powered Fitness & Nutrition', MARGIN, 292);
        doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN, 292, { align: 'right' });
    }

    doc.save(`FitVision-MealPlan-${new Date().toISOString().split('T')[0]}.pdf`);
};
