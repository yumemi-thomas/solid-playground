// Navigation uses a real URL; running code uses the matching event prop. Keeping
// the two separate is what makes each one auditable.
export function Actions() {
  return (
    <div>
      <a href="/dismiss">Dismiss</a>
      <button type="button" onClick={() => console.log('dismissed')}>
        Dismiss now
      </button>
    </div>
  );
}
