// Tambahkan elemen baru ke HTML secara dinamis
// Gantilah script.js lama dengan versi yang telah ditingkatkan berikut

const processes = [
  { name: 'P1', arrival: 0, burst: 10, priority: 3 },
  { name: 'P2', arrival: 2, burst: 5, priority: 1 },
  { name: 'P3', arrival: 4, burst: 8, priority: 4 },
  { name: 'P4', arrival: 6, burst: 3, priority: 2 },
  { name: 'P5', arrival: 8, burst: 6, priority: 5 },
];

function startSimulation(type) {
  const simDiv = document.getElementById('simulation');
  const beforeDiv = document.getElementById('beforeSchedule');
  const animDiv = document.getElementById('cpuAnimation');
  const title = document.getElementById('judulSimulasi');

  let ganttChart = document.getElementById('ganttChart');
  if (!ganttChart) {
    ganttChart = document.createElement('div');
    ganttChart.id = 'ganttChart';
    ganttChart.className = 'gantt';
    simDiv.appendChild(ganttChart);
  }
  ganttChart.innerHTML = '';

  let resultTable = document.getElementById('resultTable');
  if (!resultTable) {
    resultTable = document.createElement('table');
    resultTable.id = 'resultTable';
    simDiv.appendChild(resultTable);
  }
  resultTable.innerHTML = '';

  simDiv.classList.remove('hidden');
  beforeDiv.innerHTML = "";
  animDiv.innerHTML = "";

  let queue = [...processes];

  if (type === 'fcfs') {
    title.textContent = "Simulasi FCFS";
    queue.sort((a, b) => a.arrival - b.arrival);
  } else if (type === 'sjf') {
    title.textContent = "Simulasi SJF";
    queue.sort((a, b) => a.burst - b.burst);
  }

  let currentTime = 0;
  const results = [];

  // Masukkan ke ready queue satu per satu sebelum mulai animasi CPU
  let delay = 0;
  queue.forEach((p, index) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `process ${p.name}`;
      el.textContent = `${p.name} (${p.burst}ms)`;
      beforeDiv.appendChild(el);
    }, delay);
    delay += 400;
  });

  // Mulai CPU Animation setelah ready queue selesai muncul
  setTimeout(() => {
    let totalDelay = 0;
    queue.forEach((p, i) => {
      const startTime = Math.max(currentTime, p.arrival);
      const completionTime = startTime + p.burst;
      const waitingTime = startTime - p.arrival;
      const turnaroundTime = completionTime - p.arrival;

      results.push({
        ...p,
        startTime,
        completionTime,
        waitingTime,
        turnaroundTime,
      });

      setTimeout(() => {
        const processContainer = document.createElement('div');
        processContainer.style.marginBottom = '20px';

        const label = document.createElement('div');
        label.textContent = `${p.name} (Sedang Dieksekusi)`;
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '5px';

        const dotContainer = document.createElement('span');
        dotContainer.className = `process ${p.name}`;
        dotContainer.style.display = 'inline-block';

        processContainer.appendChild(label);
        processContainer.appendChild(dotContainer);
        animDiv.appendChild(processContainer);

        for (let j = 0; j < p.burst; j++) {
          setTimeout(() => {
            const dot = document.createElement('span');
            dot.textContent = ' ●';
            dot.className = 'dot';
            dot.style.opacity = '0';
            dotContainer.appendChild(dot);
            requestAnimationFrame(() => dot.style.opacity = '1');
          }, j * 300);
        }

        // Setelah selesai, ubah label
        setTimeout(() => {
          label.textContent = `${p.name} (Selesai)`;
          label.style.color = 'green';
        }, p.burst * 300 + 100);
      }, totalDelay);

      totalDelay += p.burst * 300 + 600;
      currentTime = completionTime;
    });

    // Gantt chart & result table
    setTimeout(() => {
      let ganttHTML = '<h3>Gantt Chart</h3><div style="display:flex;justify-content:center;gap:2px;">';
      results.forEach(p => {
        ganttHTML += `<div style="padding:10px;background-color:#ccc;border:1px solid #999;min-width:50px;">
          ${p.name}<br><small>${p.startTime}-${p.completionTime}</small>
        </div>`;
      });
      ganttHTML += '</div>';
      ganttChart.innerHTML = ganttHTML;

      let tableHTML = '<thead><tr><th>Proses</th><th>Arrival</th><th>Burst</th><th>Start</th><th>Complete</th><th>WT</th><th>TAT</th></tr></thead><tbody>';
      let totalWT = 0, totalTAT = 0;
      results.forEach(p => {
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
        tableHTML += `<tr><td>${p.name}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${p.startTime}</td><td>${p.completionTime}</td><td>${p.waitingTime}</td><td>${p.turnaroundTime}</td></tr>`;
      });
      tableHTML += `<tr style="font-weight:bold;"><td colspan="5">Rata-rata</td><td>${(totalWT / results.length).toFixed(2)}</td><td>${(totalTAT / results.length).toFixed(2)}</td></tr>`;
      tableHTML += '</tbody>';
      resultTable.innerHTML = tableHTML;
    }, totalDelay + 500);
  }, delay + 500);
}