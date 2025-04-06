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

    // Urutan awal
    queue.forEach(p => {
      const el = document.createElement('div');
      el.className = `process ${p.name}`;
      el.textContent = `${p.name} (${p.burst}ms)`;
      beforeDiv.appendChild(el);
    });

    // Animasikan titik-titik
    let totalDelay = 0;

    queue.forEach((p) => {
      setTimeout(() => {
        const processContainer = document.createElement('div');
        processContainer.style.marginBottom = '20px';
        const label = document.createElement('div');
        label.textContent = `${p.name}:`;
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
      }, totalDelay);

      totalDelay += p.burst * 300 + 600; //ini durasi titik + jeda antar proses
    });
  }