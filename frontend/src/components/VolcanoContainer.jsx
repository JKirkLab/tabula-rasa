import React, { useState } from 'react';
import VolcanoSelect from './VolcanoSelect';
import VolcanoPlot from './VolcanoPlot';

function VolcanoContainer() {
    const [main, setMain] = useState(null);
    const [sub1, setSub1] = useState(null);
    const [sub2, setSub2] = useState(null);

    return (
        <div>
            <VolcanoSelect
                main={main}
                setMain={setMain}
                sub1={sub1}
                setSub1={setSub1}
                sub2={sub2}
                setSub2={setSub2}
            />
            <VolcanoPlot timePoint={main} protein={sub1} condition={sub2} />
        </div>
    );
}

export default VolcanoContainer;
