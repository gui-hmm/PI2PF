document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const csvData = e.target.result;
            processData(csvData);
        };

        reader.readAsText(file);
    }
}

function processData(csvData) {
    const lines = csvData.split('\n');
    const data = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    };

    const countOccurrences = {};

    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(';'); // Alteração aqui para ponto e vírgula
        data.labels.push(columns[0]); // Assuming the first column contains labels

        // Use column 11 (index 10) for pie chart
        data.datasets[0].data.push(columns[10]);

        // Use column 16 (index 15) for counting occurrences
        const value = parseInt(columns[15]); // Parse as integer
        countOccurrences[value] = (countOccurrences[value] || 0) + 1;
    }

    createPieChart(data);
    createBarChart(countOccurrences);
}

function createPieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.datasets[0].data,
                backgroundColor: data.datasets[0].backgroundColor
            }]
        }
    });
}

function createBarChart(countOccurrences) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(countOccurrences),
            datasets: [{
                data: Object.values(countOccurrences),
                backgroundColor: Object.keys(countOccurrences).map(() => getRandomColor())
            }]
        }
    });
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}
