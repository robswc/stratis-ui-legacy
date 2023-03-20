'use client'
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

interface Input {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
    value: any;
    type: string
}


function StrategyForm({ name, runCallback }: { name: string, runCallback: (data: any) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [autoRun, setAutoRun] = useState(false);
    const [inputs, setInputs] = useState<Input[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/v1/strategy/?name=${name}`).then(res => res.json()).then(data => {
            const parameters = data.parameters;
            const inputs = parameters.map((p: any) => ({ type: p.type, name: p.name, value: p.value }))
            setInputs(inputs);
        })
    }, []);

    const onSubmit = (data: any) => {
        runCallback(data);
    };

    const convertToObject = (inputs: Input[]) => {
        const obj: any = {};
        inputs.forEach(input => {
            obj[input.name] = input.value;
        });
        return obj;
    }

    const renderInputs = () => {
        return inputs.map((input, index) => {
            const { type, name, value } = input;
            let jsType = typeof value;
            const options = jsType === 'number' ? {required: true, value: value, valueAsNumber: true} : {required: true, value: value}
            return (
                <div key={index} className='flex items-center justify-between gap-3'>
                    <div>
                        <div className='text-info'>{name}</div>
                        <div className='opacity-50 italic'>type : {jsType}</div>
                    </div>
                    <input
                        {...register(name, options)}
                        type={jsType}
                        className='input input-bordered w-24 text-lg'

                        onChange={(e) => {
                            if (autoRun) {
                                // add a small delay in future, if user is typing to avoid multiple requests
                                const newInputs = [...inputs];
                                const newValue = jsType === 'number' ? Number(e.target.value) : e.target.value;
                                newInputs[index] = { ...newInputs[index], value: newValue };
                                setInputs(newInputs);
                                runCallback(convertToObject(newInputs));
                            }
                        }}

                    />
                </div>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2 mb-3'>{renderInputs()}</div>
            <div className='flex gap-2 items-center w-full'>
                <div className='form-control gap-2'>
                    <label className="label cursor-pointer">
                        <span className="label-text pr-2">Auto Run</span>
                        <input checked={autoRun} type="checkbox" className="toggle toggle-info" onChange={() => setAutoRun(!autoRun)}/>
                    </label>
                </div>
                <div className='flex-grow'>
                    <button type="submit" className='btn btn-success w-full'>Run</button>
                </div>
            </div>
        </form>
    );
}


export default StrategyForm;
