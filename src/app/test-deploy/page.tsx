export default function Page() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-4xl font-bold">Deployment Test</h1>
            <p className="mt-4">If you see this, the site successfully rebuilt and deployed.</p>
            <div className="mt-8 p-4 bg-green-100 rounded">
                Server Time: {new Date().toISOString()}
            </div>
        </div>
    );
}
