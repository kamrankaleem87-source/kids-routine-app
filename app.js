const { useState, useEffect } = React;

function KidsRoutineApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Khana (Breakfast)', time: '08:00', type: 'food', enabled: true },
    { id: 2, name: 'Khana (Lunch)', time: '13:00', type: 'food', enabled: true },
    { id: 3, name: 'Khana (Dinner)', time: '20:00', type: 'food', enabled: true },
    { id: 4, name: 'Sone ka Time', time: '21:30', type: 'sleep', enabled: true },
    { id: 5, name: 'Fajr Namaz', time: '05:30', type: 'prayer', enabled: true },
    { id: 6, name: 'Zuhr Namaz', time: '12:30', type: 'prayer', enabled: true },
    { id: 7, name: 'Asr Namaz', time: '15:45', type: 'prayer', enabled: true },
    { id: 8, name: 'Maghrib Namaz', time: '17:45', type: 'prayer', enabled: true },
    { id: 9, name: 'Isha Namaz', time: '19:15', type: 'prayer', enabled: true },
    { id: 10, name: 'Job ke liye nikalna', time: '08:00', type: 'custom', enabled: true }
  ]);
  const [newTask, setNewTask] = useState({ name: '', time: '', type: 'custom' });
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      tasks.forEach(task => {
        if (task.enabled && task.time === currentTimeStr) {
          showNotification(task);
          playAlarm();
        }
      });
    };

    const interval = setInterval(checkTasks, 60000);
    checkTasks();
    return () => clearInterval(interval);
  }, [tasks]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const showNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const messages = {
        food: '🍽️ Khane ka time ho gaya hai!',
        sleep: '😴 Sone ka time ho gaya hai!',
        prayer: '🕌 Namaz ka time ho gaya hai!',
        custom: '⏰ Reminder!'
      };
      
      new Notification(task.name, {
        body: messages[task.type] || 'Time reminder',
        vibrate: [200, 100, 200]
      });
    }
  };

  const playAlarm = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 1000);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const addTask = () => {
    if (newTask.name && newTask.time) {
      setTasks([...tasks, { id: Date.now(), ...newTask, enabled: true }]);
      setNewTask({ name: '', time: '', type: 'custom' });
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));
  const toggleTask = (id) => setTasks(tasks.map(task => task.id === id ? { ...task, enabled: !task.enabled } : task));

  return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4' },
    React.createElement('div', { className: 'max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden' },
      React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white' },
        React.createElement('h1', { className: 'text-3xl font-bold text-center mb-2' }, '👶 Kids Daily Routine'),
        React.createElement('div', { className: 'text-center text-2xl font-mono bg-white bg-opacity-20 rounded-lg p-3' },
          currentTime.toLocaleTimeString('en-US', { hour12: false })
        ),
        React.createElement('div', { className: 'text-center text-sm mt-2 opacity-90' },
          currentTime.toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        )
      ),
      
      notificationPermission !== 'granted' && React.createElement('div', { className: 'bg-yellow-100 border-l-4 border-yellow-500 p-4 m-4' },
        React.createElement('button', {
          onClick: requestNotificationPermission,
          className: 'w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600'
        }, '🔔 Notifications Enable Karen')
      ),
      
      React.createElement('div', { className: 'p-4' },
        React.createElement('div', { className: 'mb-6 bg-gray-50 p-4 rounded-lg' },
          React.createElement('h3', { className: 'font-bold mb-3 text-lg' }, '➕ Naya Task Add Karen'),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Task ka naam',
            value: newTask.name,
            onChange: (e) => setNewTask({...newTask, name: e.target.value}),
            className: 'w-full p-3 border rounded-lg mb-2'
          }),
          React.createElement('input', {
            type: 'time',
            value: newTask.time,
            onChange: (e) => setNewTask({...newTask, time: e.target.value}),
            className: 'w-full p-3 border rounded-lg mb-2'
          }),
          React.createElement('select', {
            value: newTask.type,
            onChange: (e) => setNewTask({...newTask, type: e.target.value}),
            className: 'w-full p-3 border rounded-lg mb-3'
          },
            React.createElement('option', { value: 'custom' }, 'Custom'),
            React.createElement('option', { value: 'food' }, 'Khana'),
            React.createElement('option', { value: 'sleep' }, 'Sona'),
            React.createElement('option', { value: 'prayer' }, 'Namaz')
          ),
          React.createElement('button', {
            onClick: addTask,
            className: 'w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600'
          }, '➕ Add Task')
        ),
        
        React.createElement('div', { className: 'space-y-3' },
          tasks.map(task => React.createElement('div', {
            key: task.id,
            className: `p-4 rounded-lg border-2 ${task.enabled ? 'bg-white border-blue-300' : 'bg-gray-100 border-gray-300 opacity-60'}`
          },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center gap-3 flex-1' },
                React.createElement('button', {
                  onClick: () => toggleTask(task.id),
                  className: `w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.enabled ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`
                },
                  task.enabled && React.createElement('span', { className: 'text-white text-xs' }, '✓')
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'font-semibold' }, task.name),
                  React.createElement('div', { className: 'text-sm text-gray-600' }, task.time)
                )
              ),
              React.createElement('button', {
                onClick: () => deleteTask(task.id),
                className: 'text-red-500 hover:bg-red-100 p-2 rounded-lg text-xl'
              }, '🗑️')
            )
          ))
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(KidsRoutineApp));
