export default function Page() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Vercel Deployment Status: ACTIVE</h1>
            <p>Update Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
