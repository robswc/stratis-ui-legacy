'use client'
import {useEffect, useState} from 'react';
import {Controller, FormProvider, useForm, useFormContext} from 'react-hook-form';

interface DaisyInputProps {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
    type: string
}

function DaisyParameterInput(props: DaisyInputProps) {
    const { name, label, tip, placeholder } = props;
    const { control, formState: { errors } } = useFormContext();

    return (
        <>
            <label className="label">
                <span className={label}>{tip}</span>
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <label className="input-group">
                        <span>{label}</span>
                        <input {...field} type="text" placeholder={placeholder} className="input input-bordered w-full" />
                    </label>
                )}
            />
            {errors[name] && <span>This field is required</span>}
        </>
    );
}

function StrategyForm({ name, runCallback }: { name: string, runCallback: (data: any) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [inputs, setInputs] = useState<Input[]>([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/strategy/?name=${name}`).then(res => res.json()).then(data => {
            const parameters = data.parameters;
            setInputs(parameters.map((p: any) => ({ type: p.type, name: p.name, value: p.value })));
        })
    }, []);

    const onSubmit = (data: any) => {
        runCallback(data);
    };

    const renderInputs = () => {
        return inputs.map((input, index) => {
            const { type, name, value } = input;
            let jsType = typeof value;
            return (
                <div key={index} className='flex items-center justify-between gap-3'>
                    <div>
                        <div className='text-secondary-content'>{name}</div>
                        <div className='text-opacity-25 text-neutral-content italic'>type : {typeof value}</div>
                    </div>
                    <input {...register(name, { required: true, value: value })} type={jsType} className='input input-bordered w-24 text-lg' />
                </div>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2 mb-3'>{renderInputs()}</div>
            <div className='flex gap-2'>
                <button type="submit" className='btn btn-success w-full'>Run</button>
            </div>
        </form>
    );
}

function StrategyForm2({ name, runCallback }: { name: string, runCallback: (data: any) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [inputs, setInputs] = useState<DaisyInputProps[]>([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/strategy/?name=${name}`).then(res => res.json()).then(data => {
            const parameters = data.parameters;
            setInputs(parameters.map((p: any) => ({ type: p.type, name: p.name, value: p.value })));
        })
    }, []);

    const onSubmitHandler = (data: any) => {
        runCallback(data.adapter, data.data);
    };

    const renderInputs = () => {
        return inputs.map((input, index) => {
            const { type, name, value } = input;
            let jsType = typeof value;
            return (
                <DaisyParameterInput name={name} label={name} tip={name} placeholder={value} type={jsType} key={index} />
            );
        });
    };


    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)} className='flex flex-col gap-6'>
                {renderInputs()}
                <button type="submit" className='btn btn-secondary w-full'>Load Data</button>
            </form>
        </FormProvider>
    );
}


export default StrategyForm;
