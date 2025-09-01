<script>
 let seconds = 5;

 if (typeof window !== 'undefined') {
  const intervalId = setInterval(() => {
   seconds -= 1;
   if (seconds <= 0) {
    clearInterval(intervalId);
    window.location.href = '/';
   }
  }, 1000);
 }
</script>

<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;font-size:2rem;">
 Redirecting to Prime Overwatch in {seconds}s...
</div>


