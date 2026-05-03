// Replace lines 186-199 to always show the register button

<Button
  type="submit"
  disabled={loading}
  className={`register-button ${loading ? 'loading' : ''}`}
>
  {loading ? 'Registering...' : 'Register'}
</Button>