export interface StudentInterface
{
    student_id: string;
    student_name: string;
    email: string;
}

export interface ResponseInterface
{
    status: string;
    messageReturn: string;
}

export interface ErrorMessageInerface
{
    status: string;
    errorCode: string;
    errorMessage: string;
}
