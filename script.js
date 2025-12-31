document.addEventListener('DOMContentLoaded', () => {
    addModule(); // Add initial module
});

function addModule() {
    const list = document.getElementById('modulesList');
    const template = document.getElementById('moduleTemplate');
    const clone = template.content.cloneNode(true);

    // Add real-time input listener
    const inputs = clone.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateModuleAverage(input.closest('tr'));
        });
    });

    list.appendChild(clone);
}

function removeModule(btn) {
    const row = btn.closest('tr');
    const list = document.getElementById('modulesList');
    if (list.children.length > 1) {
        row.style.opacity = '0';
        setTimeout(() => {
            row.remove();
        }, 300);
    } else {
        alert('يجب أن تحتوي القائمة على مادة واحدة على الأقل');
    }
}

function updateModuleAverage(row) {
    const exam = parseFloat(row.querySelector('.input-exam').value) || 0;
    const td = parseFloat(row.querySelector('.input-td').value) || 0;
    const tpInput = row.querySelector('.input-tp').value;
    const tp = tpInput !== '' ? parseFloat(tpInput) : null;

    let average = 0;
    let continuous = 0;

    if (tp !== null) {
        continuous = (td + tp) / 2;
    } else {
        continuous = td;
    }

    average = (exam * 0.6) + (continuous * 0.4);

    // Display module average
    const display = row.querySelector('.module-avg');
    display.textContent = average.toFixed(2);
    display.style.color = average >= 10 ? '#00b894' : '#ff7675';
}

function calculateGPA() {
    const rows = document.querySelectorAll('.module-row');
    let totalPoints = 0;
    let totalCoeff = 0;
    let hasError = false;

    rows.forEach(row => {
        const coeff = parseFloat(row.querySelector('.input-coeff').value) || 1;
        const exam = parseFloat(row.querySelector('.input-exam').value) || 0;
        const td = parseFloat(row.querySelector('.input-td').value) || 0;
        const tpInput = row.querySelector('.input-tp').value;
        const tp = tpInput !== '' ? parseFloat(tpInput) : -1;

        if (exam > 20 || td > 20 || (tp > 20 && tp !== -1)) {
            hasError = true;
            row.querySelector('.input-exam').style.borderColor = '#ff7675'; // Highlight exam input as generic error indicator or we could highlight specific ones
        } else {
            row.querySelectorAll('input').forEach(i => i.style.borderColor = 'rgba(255, 255, 255, 0.1)');
        }

        let continuous = 0;
        if (tp !== -1) {
            continuous = (td + tp) / 2;
        } else {
            continuous = td;
        }

        const avg = (exam * 0.6) + (continuous * 0.4);

        totalPoints += avg * coeff;
        totalCoeff += coeff;
    });

    if (hasError) {
        alert('يرجى التأكد من أن النقاط لا تتجاوز 20');
        return;
    }

    if (totalCoeff === 0) return;

    const gpa = totalPoints / totalCoeff;
    showResult(gpa);
}

function showResult(gpa) {
    const modal = document.getElementById('resultModal');
    const gpaDisplay = document.getElementById('finalGPA');
    const message = document.getElementById('gradeMessage');

    modal.style.display = 'flex';

    // Animate Number
    let current = 0;
    const interval = setInterval(() => {
        current += 0.1;
        if (current >= gpa) {
            current = gpa;
            clearInterval(interval);
        }
        gpaDisplay.textContent = current.toFixed(2);

        // Update circle gradient based on percent
        const percent = (current / 20) * 100;
        document.querySelector('.gpa-circle').style.background =
            `conic-gradient(${gpa >= 10 ? '#00b894' : '#ff7675'} ${percent}%, rgba(255,255,255,0.1) 0%)`;

    }, 20);

    // Messages
    if (gpa >= 16) message.textContent = "تقدير ممتاز! 🌟";
    else if (gpa >= 14) message.textContent = "تقدير جيد جداً! 👏";
    else if (gpa >= 12) message.textContent = "تقدير جيد! 👍";
    else if (gpa >= 10) message.textContent = "ناجح! ✅";
    else message.textContent = "للأسف، راسب. حظ أوفر! 📉";
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('resultModal');
    if (event.target == modal) {
        closeModal();
    }
}
