# Kent Starbucks Ordering (KSO)

```typescript
Id: `${number}`
Key: ('cdc' | 'rdc')
    | ('initial' | 'on-hand' | 'en-route' | 'order')
    | ('eaches' | 'cases')
    | ('decrementer' | 'incrementer')
    | ('1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '<', 'OK')

Item: object {
    id: Id,
    description: string;
    uom: string,
    onHand: object {
        eaches: object {
            total: string,
            isUpdated: boolean
        },
        cases: object {
            total: string,
            isUpdated: boolean
        },
        get total(): string,
        get isUpdated(): boolean
    },
    enRoute: object {
        cases: object {
            total: string,
            isUpdated: boolean
        },
        get total(): string,
        get isUpdated(): boolean
    },
    order: object {
        cases: object {
            get total(): string
        },
        get total(): string
    },
    get total(): string,
    par: string,
    isActive: boolean,
    get isUpdated(): boolean
}

Distributor: object {
    key: Key,
    description: string,
    isActive: boolean
}

Stage: object {
    key: Key,
    description: string,
    uom?: Key,
    isActive: boolean,
    isComputational: boolean
}

Uom: object {
    key: Key,
    description: string,
    isActive: boolean
}

State: object {
    // Items
    _items: Item[],
    get items(): object { [key: Id]: Item },
    fetchItems(distributor: Key): Item[],
    clearItems(): null,
    activateItem(id: Id): Item,
    deactivateItem(): null,
    get activeItem(): Item,

    // Distributors
    _distributors: Distributor[],
    get distributors(): object { [key: Key]: Distributor },
    activateDistributor(distributor: Key): Distributor,
    deactivateDistributor(): null,
    get activeDistributor(): Distributor,

    // Stages
    _stages: Stage[],
    get stages(): object { [key: Key]: Stage },
    get computationalStages(): Stage[],
    activateStage(stage: Key): Stage,
    deactivateStage(): null,
    get activeStage(): Stage,

    // Units of Measurement (Uoms)
    _uoms: Uom[],
    get uoms(): object { [key: Key]: Uom },
    activateUom(uom: Key): Uom,
    deactivateUom(): null,
    get activeUom(): Uom,

    // Application
    selectDistributor(distributor: Key): null,
    selectItem(id: Id): null,
    selectUom(uom: Key): null,
    selectAccumulator(accumulator: Key): null,
    selectKey(key: Key): null,
    selectSubmit(): null,
}
```