

async function getHealth() {
  const res = await fetch("http://localhost:4000/health", {
    cache: "no-store",
  });
  return res.json();
}

const App=async ()=>{

  const data = await getHealth();
  return (
    <>
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>HR Payroll Platform</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
    </>
  );
}
export default App;
