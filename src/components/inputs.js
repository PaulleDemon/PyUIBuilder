import React, { useEffect, useState } from "react"
import { Input, Button, Space, Radio } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"


export const DynamicInputList = () => {
    const [inputs, setInputs] = useState([""])  // Initialize with one input

    const addInput = () => {
        setInputs([...inputs, ""])
    }

    const removeInput = (index) => {
        setInputs(inputs.filter((_, i) => i !== index))
    }

    const handleInputChange = (value, index) => {
        const newInputs = [...inputs]
        newInputs[index] = value
        setInputs(newInputs)
    }

    return (
        <div>
            {inputs.map((input, index) => (
                <Space key={index} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Input
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value, index)}
                        placeholder={`Input ${index + 1}`}
                    />
                    {index !== 0 && (  // Do not show delete button for the first input
                        <MinusCircleOutlined onClick={() => removeInput(index)} />
                    )}
                </Space>
            ))}

            <Button type="dashed" onClick={addInput} icon={<PlusOutlined />}>
                Add Input
            </Button>
        </div>
    )
}


export const DynamicRadioInputList = React.memo(({defaultInputs=[""], defaultSelected=null, onChange}) => {
    const [inputs, setInputs] = useState([""])  // Initialize with one input
    const [selectedRadio, setSelectedRadio] = useState(null)  // Tracks selected radio button

    useEffect(() => {

        setInputs(defaultInputs)

    }, [defaultInputs])

    useEffect(() => {

        setSelectedRadio(defaultSelected)
    }, [defaultSelected])

    useEffect(() => {

        if(onChange){
            onChange({inputs, selectedRadio})
        }
        
    }, [selectedRadio, inputs])

    // Add a new input
    const addInput = () => {
        setInputs([...inputs, ""])
    }

    // Remove an input by index, but keep the first one
    const removeInput = (index) => {
        const newInputs = inputs.filter((_, i) => i !== index)
        setInputs(newInputs)

        // Adjust selected radio if necessary
        if (selectedRadio >= newInputs.length) {
            setSelectedRadio(newInputs.length - 1)
        }
    }

    // Update input value
    const handleInputChange = (value, index) => {
        const newInputs = [...inputs]
        newInputs[index] = value
        setInputs(newInputs)
    }

    // Handle radio button selection
    const handleRadioChange = (e) => {
        setSelectedRadio(e.target.value)
    }

    return (
        <div>
            <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                {inputs.map((input, index) => (
                    <Space key={index} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                        <Radio value={index} defaultChecked={ index === selectedRadio}/>
                        <Input
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value, index)}
                            placeholder={`Input ${index + 1}`}
                        />
                        
                        {index !== 0 && (  // Do not show delete button for the first input
                            <div>
                                <MinusCircleOutlined className="tw-text-xl tw-text-red-500" 
                                    onClick={() => removeInput(index)} />
                            </div>
                        )}
                    </Space>
                ))}
            </Radio.Group>

            <Button type="dashed" onClick={addInput} icon={<PlusOutlined />}>
                Add Input
            </Button>
        </div>
    )
})