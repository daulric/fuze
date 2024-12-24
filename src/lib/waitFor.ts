export default function waitFor(condition: () => boolean, interval = 100): Promise<void> {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (condition()) {
          clearInterval(timer); // Stop polling
          resolve(); // Condition met
        }
      }, interval);
    });
}  