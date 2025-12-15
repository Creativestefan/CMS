import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const ApiDocs = () => {
    const [spec, setSpec] = React.useState<object>({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await fetch(`https://${projectId}.supabase.co/rest/v1/?apikey=${publicAnonKey}`);
                const data = await response.json();
                setSpec(data);
            } catch (error) {
                console.error("Error fetching API spec:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpec();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading API Docs...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-white overflow-hidden">
            <div className="h-full overflow-y-auto">
                <SwaggerUI spec={spec} />
            </div>
        </div>
    );
};

export default ApiDocs;
