class AwesomeTodoApp {
            constructor() {
                this.tasks = [];
                this.taskInput = document.getElementById('taskInput');
                this.addBtn = document.getElementById('addBtn');
                this.tasksContainer = document.getElementById('tasksContainer');
                this.emptyState = document.getElementById('emptyState');
                this.progressFill = document.getElementById('progressFill');
                this.progressText = document.getElementById('progressText');
                this.confettiCanvas = document.getElementById('confetti-canvas');
                this.ctx = this.confettiCanvas.getContext('2d');
                
                this.init();
            }
            
            init() {
                this.setupCanvas();
                this.bindEvents();
                this.render();
            }
            
            setupCanvas() {
                this.resizeCanvas();
                window.addEventListener('resize', () => this.resizeCanvas());
            }
            
            resizeCanvas() {
                this.confettiCanvas.width = window.innerWidth;
                this.confettiCanvas.height = window.innerHeight;
            }
            
            bindEvents() {
                this.addBtn.addEventListener('click', () => this.addTask());
                this.taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });
            }
            
            addTask() {
                const text = this.taskInput.value.trim();
                if (!text) return;
                
                const task = {
                    id: Date.now(),
                    text: text,
                    completed: false
                };
                
                this.tasks.push(task);
                this.taskInput.value = '';
                this.render();
            }
            
            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.render();
                    
                    if (this.allTasksCompleted() && this.tasks.length > 0) {
                        this.celebrate();
                    }
                }
            }
            
            deleteTask(id) {
                const taskElement = document.querySelector(`[data-task-id="${id}"]`);
                if (taskElement) {
                    taskElement.style.animation = 'slideOut 0.3s ease-out forwards';
                    setTimeout(() => {
                        this.tasks = this.tasks.filter(t => t.id !== id);
                        this.render();
                    }, 300);
                }
            }
            
            editTask(id, newText) {
                const task = this.tasks.find(t => t.id === id);
                if (task && newText.trim()) {
                    task.text = newText.trim();
                    this.render();
                }
            }
            
            allTasksCompleted() {
                return this.tasks.length > 0 && this.tasks.every(task => task.completed);
            }
            
            updateProgress() {
                const completed = this.tasks.filter(task => task.completed).length;
                const total = this.tasks.length;
                const percentage = total > 0 ? (completed / total) * 100 : 0;
                
                this.progressFill.style.width = `${percentage}%`;
                this.progressText.textContent = `${completed} / ${total}`;
            }
            
            render() {
                this.tasksContainer.innerHTML = '';
                
                if (this.tasks.length === 0) {
                    this.tasksContainer.appendChild(this.emptyState);
                } else {
                    this.tasks.forEach(task => {
                        const taskElement = this.createTaskElement(task);
                        this.tasksContainer.appendChild(taskElement);
                    });
                }
                
                this.updateProgress();
            }
            
            createTaskElement(task) {
                const taskDiv = document.createElement('div');
                taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskDiv.setAttribute('data-task-id', task.id);
                
                taskDiv.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="app.toggleTask(${task.id})"></div>
                    <input type="text" class="task-text ${task.completed ? 'completed' : ''}" 
                           value="${task.text}" 
                           onblur="app.editTask(${task.id}, this.value)"
                           onkeypress="if(event.key==='Enter') this.blur()">
                    <div class="task-actions">
                        <button class="delete-btn" onclick="app.deleteTask(${task.id})">×</button>
                    </div>
                `;
                
                return taskDiv;
            }
            
            celebrate() {
                document.querySelector('.container').classList.add('celebration');
                setTimeout(() => {
                    document.querySelector('.container').classList.remove('celebration');
                }, 800);
                
                this.startConfetti();
            }
            
            startConfetti() {
                const particles = [];
                const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
                
                for (let i = 0; i < 200; i++) {
                    particles.push({
                        x: Math.random() * this.confettiCanvas.width,
                        y: Math.random() * this.confettiCanvas.height - this.confettiCanvas.height,
                        vx: (Math.random() - 0.5) * 8,
                        vy: Math.random() * 4 + 3,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * 10 + 6,
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 10
                    });
                }
                
                const animate = () => {
                    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
                    
                    for (let i = particles.length - 1; i >= 0; i--) {
                        const p = particles[i];
                        
                        this.ctx.save();
                        this.ctx.translate(p.x, p.y);
                        this.ctx.rotate(p.rotation * Math.PI / 180);
                        this.ctx.fillStyle = p.color;
                        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        this.ctx.restore();
                        
                        p.x += p.vx;
                        p.y += p.vy;
                        p.rotation += p.rotationSpeed;
                        p.vy += 0.15;
                        
                        if (p.y > this.confettiCanvas.height + p.size) {
                            particles.splice(i, 1);
                        }
                    }
                    
                    if (particles.length > 0) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            }
        }
        
        // Initialize the app
        const app = new AwesomeTodoApp();