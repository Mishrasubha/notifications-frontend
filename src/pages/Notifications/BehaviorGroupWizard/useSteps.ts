import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';

import { ExtendedWizardStep } from '../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { useActionAndRecipientStep } from './Steps/ActionAndRecipientsStep';
import { AssociateEventTypesStepProps } from './Steps/AssociateEventTypesStep';
import { useBasicInformationStep } from './Steps/BasicInformationStep';
import { createReviewStep } from './Steps/ReviewStep';

export const useSteps = (associateEventTypeStep: AssociateEventTypesStepProps, currentStep: number, isValid: boolean): Array<ExtendedWizardStep> => {

    const basicInformationStep = useBasicInformationStep();
    // Disabled while we get the service to assign a behavior group to event types
    // const associateEventTypesStep = useAssociateEventTypesStep(associateEventTypeStep);
    const actionAndRecipientStep = useActionAndRecipientStep();

    const [ maxStep, setMaxStep ] = useState<number>(0);
    const [ invalidSteps, setInvalidSteps ] = useState<Set<number>>(() => new Set<number>());

    useEffect(() => {
        setMaxStep(prev => Math.max(currentStep, prev));
    }, [ currentStep ]);

    useEffect(() => {
        setInvalidSteps(produce(draft => {
            if (isValid) {
                draft.delete(currentStep);
            } else {
                draft.add(currentStep);
            }
        }));
    }, [ currentStep, isValid ]);

    const lastAvailableStep = invalidSteps.size === 0 ? maxStep : Math.min(...Array.from(invalidSteps));

    return useMemo(() => {
        return [
            basicInformationStep,
            actionAndRecipientStep,
            // Disabled while we get the service to assign a behavior group to event types
            // associateEventTypesStep,
            createReviewStep()
        ].map((step, index) => ({
            ...step,
            id: index,
            canJumpTo: index <= lastAvailableStep,
            hideCancelButton: false,
            enableNext: isValid
        }));
    }, [ basicInformationStep, actionAndRecipientStep, isValid, lastAvailableStep ]);
};
