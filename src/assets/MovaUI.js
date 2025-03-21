class MovaUI {
    constructor(title, watermark, extra = '', toggleKey = '') {
        const titleId = title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

        this.UI = document.createElement('div');
        this.UI.id = titleId;
        this.UI.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 280px;
            background: rgba(20, 20, 20, 0.75);
            backdrop-filter: blur(15px);
            border-radius: 16px;
            padding: 20px;
            color: white;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 2147483647;
            cursor: move;
            transition: all 0.3s ease;
            user-select: none;
            border: 1px solid rgba(255, 255, 255, 0.15);
            letter-spacing: 0.3px;
            line-height: 1.5;
        `;

        this.UI.innerHTML = `
            <h2 id="${titleId}Header" style="margin: 0 0 15px; font-size: clamp(18px, 5vw, 24px); text-align: center; font-weight: 600; color: rgba(255, 255, 255, 0.95); letter-spacing: 0.5px;">${title}</h2>
            <div id="${titleId}Extra" style="font-size: clamp(14px, 4vw, 16px); text-align: center; margin-bottom: 15px; overflow-wrap: break-word; color: rgba(255, 255, 255, 0.85); line-height: 1.6;">${extra.replace(/\n/g, '<br>')}</div>
            <div id="${titleId}ButtonContainer"></div>
            <div id="${titleId}SliderContainer"></div>
            <div id="${titleId}Watermark" style="font-size: clamp(10px, 3vw, 12px); text-align: center; margin-top: 15px; color: rgba(255, 255, 255, 0.7); font-weight: 500;">${watermark}</div>
            <style>
                #${titleId} button {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                }
                #${titleId} button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                #${titleId} button:active {
                    transform: translateY(0);
                }
                #${titleId} input[type="range"] {
                    width: 100%;
                    margin: 10px 0;
                    -webkit-appearance: none;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    height: 6px;
                }
                #${titleId} input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                #${titleId} input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                }
                #${titleId} .slider-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 15px 0;
                    padding: 5px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                }
                #${titleId} .slider-label, #${titleId} .slider-value {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.9);
                    padding: 0 10px;
                }
                #${titleId} input[type="text"] {
                    width: 100%;
                    margin-top: 10px;
                    padding: 10px;
                    border: none;
                    border-radius: 10px;
                    background: rgb(50, 50, 50);
                    color: white;
                    font-size: 16px;
                    text-shadow: 1px 1px 2px black;
                }
                #${titleId} .confirm-button, #${titleId} .cancel-button {
                    background: rgb(50, 50, 50);
                    border-radius: 10px;
                }
            </style>
        `;

        document.body.appendChild(this.UI);
        this.setupDragging();

        if (toggleKey) {
            this.setupToggle(toggleKey);
        }
    }

    setupDragging() {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let targetX = 0;
        let targetY = 0;

        const dragStart = (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === this.UI || e.target.tagName === 'H2') {
                isDragging = true;
                this.UI.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
            }
        };

        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                targetX = currentX;
                targetY = currentY;
            }
        };

        const dragEnd = () => {
            isDragging = false;
            this.UI.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        };

        const lerp = (start, end, factor) => {
            return (1 - factor) * start + factor * end;
        };

        const updatePosition = () => {
            if (isDragging || Math.abs(xOffset - targetX) > 0.1 || Math.abs(yOffset - targetY) > 0.1) {
                xOffset = lerp(xOffset, targetX, 0.2);
                yOffset = lerp(yOffset, targetY, 0.2);
                this.UI.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
            }
            requestAnimationFrame(updatePosition);
        };

        this.UI.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        updatePosition();
    }

    setupToggle(toggleKey) {
        document.addEventListener('keydown', (e) => {
            if (e.key === toggleKey) {
                this.UI.style.display = this.UI.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    addButton(name, onClick = () => {}) {
        const button = document.createElement('button');
        button.textContent = name;
        button.onclick = onClick;
        this.UI.querySelector(`#${this.UI.id}ButtonContainer`).appendChild(button);
    }

    addSlider(name, onSlide = () => {}, min = 0, max = 100, value = 50) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const label = document.createElement('span');
        label.className = 'slider-label';
        label.textContent = name;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = value;

        slider.oninput = (e) => {
            valueDisplay.textContent = e.target.value;
            onSlide(e.target.value);
        };

        sliderContainer.append(label, slider, valueDisplay);
        this.UI.querySelector(`#${this.UI.id}SliderContainer`).appendChild(sliderContainer);
    }

    showToast(text, color = 'green', duration = 3000) {
        const rgbColor = this._hexToRGB(color);
        const toast = document.createElement('div');
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: -400px;
            background: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.15);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            padding: 16px 24px;
            border-radius: 16px;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            font-size: clamp(14px, 3vw, 16px);
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2147483647;
            opacity: 0;
            max-width: min(400px, 90vw);
            box-sizing: border-box;
            box-shadow: 
                0 8px 32px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2),
                0 4px 8px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            transform: translateY(20px);
        `;

        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255, 255, 255, 0.98);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        `;

        const message = document.createElement('div');
        message.style.cssText = `
            flex: 1;
            font-weight: 500;
        `;
        message.textContent = text;

        contentWrapper.appendChild(message);
        toast.appendChild(contentWrapper);
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.right = '20px';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.right = '-400px';
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    _hexToRGB(color) {
        const colorMap = {
            red: '#ff0000',
            green: '#00ff00',
            blue: '#0000ff',
            yellow: '#ffff00',
            purple: '#800080',
            orange: '#ffa500',
            black: '#000000',
            white: '#ffffff',
            gray: '#808080',
            pink: '#ffc0cb'
        };

        let hex = colorMap[color.toLowerCase()] || color;
        let r = 0, g = 0, b = 0;
        
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        
        return { r, g, b };
    }

    _calculateBrightness({ r, g, b }) {
        return Math.round((r * 299 + g * 587 + b * 114) / 1000);
    }

    showPrompt(innerHTML, defaultText = '', onEnter = () => {}) {
        const promptId = `${this.UI.id}Prompt`;
        const prompt = document.createElement('div');
        prompt.id = promptId;
        prompt.style.cssText = `
            position: fixed;
            top: -200px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 30, 30, 0.7);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            font-size: 18px;
            text-align: center;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2147483647;
            width: 80vw;
            max-width: 350px;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.2),
                0 4px 8px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            opacity: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        `;

        prompt.innerHTML = `
            <div style="margin-bottom: 20px; font-weight: 500; color: rgba(255, 255, 255, 0.95);">
                ${innerHTML.replace(/\n/g, '<br>')}
            </div>
            <input type="text" style="
                width: 100%;
                margin-top: 15px;
                padding: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(5px);
                color: white;
                font-size: 16px;
                font-family: inherit;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                outline: none;
            " value="${defaultText}">
        `;

        document.body.appendChild(prompt);

        const input = prompt.querySelector('input');
        
        input.addEventListener('focus', () => {
            input.style.background = 'rgba(255, 255, 255, 0.15)';
            input.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });

        input.addEventListener('blur', () => {
            input.style.background = 'rgba(255, 255, 255, 0.1)';
            input.style.boxShadow = 'none';
        });

        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                onEnter(input.value);
                prompt.style.top = '-200px';
                prompt.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(prompt);
                }, 500);
            }
        });

        setTimeout(() => {
            prompt.style.top = '20px';
            input.focus();
        }, 100);
    }

    showConfirm(message) {
        return new Promise((resolve) => {
            const confirmId = `${this.UI.id}Confirm`;
            const confirmBox = document.createElement('div');
            confirmBox.id = confirmId;
            confirmBox.style.cssText = `
                position: fixed;
                top: -220px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(30, 30, 30, 0.7);
                backdrop-filter: blur(16px) saturate(180%);
                -webkit-backdrop-filter: blur(16px) saturate(180%);
                color: white;
                padding: 25px;
                border-radius: 16px;
                font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                font-size: 18px;
                text-align: center;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2147483647;
                width: 80vw;
                max-width: 350px;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.2),
                    0 4px 8px rgba(0, 0, 0, 0.1),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                opacity: 1;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            `;

            confirmBox.innerHTML = `
                <div style="margin-bottom: 20px; font-weight: 500; color: rgba(255, 255, 255, 0.95);">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="confirm-button">Yes</button>
                    <button class="cancel-button">No</button>
                </div>
            `;

            document.body.appendChild(confirmBox);
    
            const buttons = confirmBox.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.cssText = `
                    flex: 1;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                `;
                
                button.addEventListener('mouseover', () => {
                    button.style.background = 'rgba(255, 255, 255, 0.2)';
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                });
                
                button.addEventListener('mouseout', () => {
                    button.style.background = 'rgba(255, 255, 255, 0.1)';
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = 'none';
                });
                
                button.addEventListener('mousedown', () => {
                    button.style.transform = 'translateY(0)';
                });
            });
    
            const yesButton = confirmBox.querySelector('.confirm-button');
            const noButton = confirmBox.querySelector('.cancel-button');
    
            yesButton.addEventListener('click', () => {
                confirmBox.style.top = '-220px';
                confirmBox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(confirmBox);
                    resolve(true);
                }, 500);
            });
    
            noButton.addEventListener('click', () => {
                confirmBox.style.top = '-220px';
                confirmBox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(confirmBox);
                    resolve(false);
                }, 500);
            });
    
            setTimeout(() => {
                confirmBox.style.top = '20px';
            }, 100);
        });
    }
    
}

export { MovaUI }