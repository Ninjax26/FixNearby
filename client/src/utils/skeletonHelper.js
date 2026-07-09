/**
 * Helper to build configuration mappings for dynamic skeletons.
 * Prevents repeating markup structure.
 */
export function getSkeletonConfig(type = 'card') {
  switch (type) {
    case 'list':
      return { height: 'h-10', width: 'w-full', rows: 5 };
    case 'profile':
      return { height: 'h-24', width: 'w-24', rows: 1 };
    default:
      return { height: 'h-32', width: 'w-full', rows: 3 };
  }
}

export default {
  getSkeletonConfig
};
