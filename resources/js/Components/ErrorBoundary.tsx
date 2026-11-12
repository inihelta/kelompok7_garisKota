import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Terjadi Kesalahan
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi
                        administrator jika masalah berlanjut.
                    </p>
                    <Button
                        onClick={this.handleRetry}
                        className="gap-2"
                        variant="default"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </Button>
                    {import.meta.env.DEV && this.state.error && (
                        <details className="mt-6 text-left w-full max-w-md">
                            <summary className="text-sm text-gray-500 cursor-pointer">
                                Detail Error (Development)
                            </summary>
                            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}