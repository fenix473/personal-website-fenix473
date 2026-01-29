/**
 * Orbital Simulation for React/Next.js
 * Pre-calculates all positions and provides fast lookup by date/time
 */

// Physical constants
const G = 6.67e-11;
const M_SUN = 1.99e30;
const DELTA_T = 3600; // 1 hour per step

/**
 * Calculate distance from origin
 */
function calculateDistance(x, y) {
  return Math.sqrt(x * x + y * y);
}

/**
 * Calculate gravitational acceleration
 */
function calculateAcceleration(x, y) {
  const r = calculateDistance(x, y);
  const r_cubed = r * r * r;
  return {
    ax: -G * M_SUN * x / r_cubed,
    ay: -G * M_SUN * y / r_cubed
  };
}

/**
 * One Euler integration step
 */
function eulerStep(state, dt = DELTA_T) {
  const { ax, ay } = calculateAcceleration(state.x, state.y);
  
  return {
    t: state.t + 1,
    x: state.x + state.vx * dt,
    y: state.y + state.vy * dt,
    vx: state.vx + ax * dt,
    vy: state.vy + ay * dt
  };
}

/**
 * Pre-calculate all orbital positions for a full year
 * This runs ONCE and creates an indexed array
 */
function calculateOrbitData(numSteps = 8760) {
  const orbitData = [];
  
  // Initial conditions (Earth at perihelion, Jan 1)
  let state = {
    t: 0,
    x: 1.47e11,    // 147 million km
    y: 0,
    vx: 0,
    vy: 30300      // ~30.3 km/s
  };
  
  orbitData.push({ ...state });
  
  // Calculate all positions
  for (let i = 1; i <= numSteps; i++) {
    state = eulerStep(state);
    orbitData.push({ ...state });
  }
  
  return orbitData;
}

/**
 * Get the time step index for a given date
 * @param {Date} currentDate - The date to look up
 * @param {Date} startDate - The simulation start date (default: Jan 1, 2026)
 * @returns {number} The index in the orbitData array
 */
function getTimeStepIndex(currentDate, startDate = new Date('2026-01-01T00:00:00Z')) {
  const timeDiffMs = currentDate.getTime() - startDate.getTime();
  const timeDiffSeconds = timeDiffMs / 1000;
  const index = Math.floor(timeDiffSeconds / DELTA_T);
  return index;
}

/**
 * Get Earth's position for a specific date
 * @param {Array} orbitData - Pre-calculated orbit data
 * @param {Date} date - The date to get position for
 * @param {Date} startDate - The simulation start date
 * @returns {Object} { x, y, vx, vy } or null if out of range
 */
function getPositionAtDate(orbitData, date, startDate = new Date('2026-01-01T00:00:00Z')) {
  const index = getTimeStepIndex(date, startDate);
  
  // Handle out of range
  if (index < 0 || index >= orbitData.length) {
    return null;
  }
  
  return orbitData[index];
}

/**
 * Get Earth's position for TODAY
 * @param {Array} orbitData - Pre-calculated orbit data
 * @param {Date} startDate - The simulation start date
 * @returns {Object} { x, y, vx, vy }
 */
function getTodayPosition(orbitData, startDate = new Date('2026-01-01T00:00:00Z')) {
  return getPositionAtDate(orbitData, new Date(), startDate);
}

// Pre-calculate orbit data (do this ONCE when module loads)
// In React, you might want to do this in a useMemo or store it in state
let ORBIT_DATA_CACHE = null;

/**
 * Get or create the orbit data cache
 * Call this once in your app initialization
 */
function getOrbitData() {
  if (!ORBIT_DATA_CACHE) {
    console.log('Calculating orbit data...');
    ORBIT_DATA_CACHE = calculateOrbitData(8760);
    console.log(`Orbit data ready: ${ORBIT_DATA_CACHE.length} positions`);
  }
  return ORBIT_DATA_CACHE;
}

/**
 * Simple function to get today's x, y coordinates
 * This is what you'd typically use in your React component
 */
function getEarthPositionToday() {
  const orbitData = getOrbitData();
  const position = getTodayPosition(orbitData);
  
  if (!position) {
    return { x: 0, y: 0, error: 'Date out of range' };
  }
  
  return {
    x: position.x,
    y: position.y,
    vx: position.vx,
    vy: position.vy,
    distanceFromSun: calculateDistance(position.x, position.y)
  };
}

// Export for ES modules (React/Next.js)
export {
  calculateOrbitData,
  getTimeStepIndex,
  getPositionAtDate,
  getTodayPosition,
  getOrbitData,
  getEarthPositionToday,
  DELTA_T
};

// Also support CommonJS for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateOrbitData,
    getTimeStepIndex,
    getPositionAtDate,
    getTodayPosition,
    getOrbitData,
    getEarthPositionToday,
    DELTA_T
  };
}
