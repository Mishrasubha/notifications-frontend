import {
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardHeaderMain,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    Grid,
    GridItem,
    KebabToggle,
    Skeleton,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import { c_form__label_FontSize } from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { BehaviorGroup } from '../../../types/Notification';
import { ActionComponent } from '../ActionComponent';
import { Recipient } from '../Recipient';

const cardClassName = style({
    width: 450,
    height: '100%'
});

const contentTitleStyle = {
    fontSize: c_form__label_FontSize.value
};

export interface BehaviorGroupProps extends OuiaComponentProps {
    behaviorGroup: BehaviorGroup;
    onEdit?: (behaviorGroup: BehaviorGroup) => void;
    onDelete?: (behaviorGroup: BehaviorGroup) => void;
}

export interface BehaviorGroupCardLayout {
    title: React.ReactNode;
    dropdownItems?: Array<React.ReactNode>;
    contents: Array<{
        key: string;
        action: React.ReactNode;
        recipient: React.ReactNode;
    }>;
}

const BehaviorGroupCardLayout: React.FunctionComponent<BehaviorGroupCardLayout> = props => {
    const [ isOpen, setOpen ] = React.useState(false);
    const { rbac } = useAppContext();

    const switchOpen = React.useCallback(() => setOpen(prev => !prev), [ setOpen ]);

    return (
        <Card isFlat className={ cardClassName }>
            <CardHeader>
                <CardHeaderMain><TextContent><Text component={ TextVariants.h4 }> { props.title } </Text></TextContent></CardHeaderMain>
                <CardActions>
                    <Dropdown
                        onSelect={ switchOpen }
                        toggle={ <KebabToggle onToggle={ setOpen } isDisabled={ !props.dropdownItems || !rbac.canWriteNotifications } /> }
                        isOpen={ isOpen }
                        isPlain
                        dropdownItems={ props.dropdownItems }
                        position={ DropdownPosition.right }
                    />
                </CardActions>
            </CardHeader>
            <CardBody>
                <Grid hasGutter>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Action</Text>
                        </TextContent>
                    </GridItem>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Recipient</Text>
                        </TextContent>
                    </GridItem>
                    { props.contents.map(content => (
                        <React.Fragment key={ content.key }>
                            <GridItem span={ 6 }>
                                { content.action }
                            </GridItem>
                            <GridItem span={ 6 }>
                                { content.recipient }
                            </GridItem>
                        </React.Fragment>
                    )) }
                </Grid>
            </CardBody>
        </Card>
    );
};

export const BehaviorGroupCard: React.FunctionComponent<BehaviorGroupProps> = props => {
    const onClickEdit = React.useCallback(() => {
        const onEdit = props.onEdit;
        if (onEdit) {
            onEdit(props.behaviorGroup);
        }
    }, [ props.behaviorGroup, props.onEdit ]);

    const onClickDelete = React.useCallback(() => {
        const onDelete = props.onDelete;
        if (onDelete) {
            onDelete(props.behaviorGroup);
        }
    }, [ props.behaviorGroup, props.onDelete ]);

    const dropdownItems = React.useMemo(() => [
        <DropdownItem key="on-edit" onClick={ onClickEdit } isDisabled={ !onClickEdit } > Edit </DropdownItem>,
        <DropdownItem key="on-delete" onClick={ onClickDelete } isDisabled={ !onClickDelete }> Delete </DropdownItem>
    ], [ onClickEdit, onClickDelete ]);

    return (
        <BehaviorGroupCardLayout
            title={ props.behaviorGroup.displayName }
            dropdownItems={ dropdownItems }
            contents={ props.behaviorGroup.actions.map((action, index) => ({
                key: `${index}-${action.type}`,
                recipient: <Recipient action={ action } />,
                action: <ActionComponent isDefault={ false } action={ action } />
            })) }
        />
    );
};

export const BehaviorGroupCardSkeleton: React.FunctionComponent = () => {
    const contentWidth = '150px';

    return (
        <BehaviorGroupCardLayout
            title={ <Skeleton width="300px" /> }
            contents={ [
                {
                    key: 'skeleton-1',
                    action: <Skeleton width={ contentWidth } />,
                    recipient: <Skeleton width={ contentWidth } />
                },
                {
                    key: 'skeleton-2',
                    action: <Skeleton width={ contentWidth } />,
                    recipient: <Skeleton width={ contentWidth } />
                },
                {
                    key: 'skeleton-3',
                    action: <Skeleton width={ contentWidth } />,
                    recipient: <Skeleton width={ contentWidth } />
                }
            ] }
        />
    );
};
