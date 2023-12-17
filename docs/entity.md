

# Entity system

### Relationship decorators

In the `./docs/examples` folder, the folder `relations` contains models that can be used as the basis to create all the relationships discussed below.

### One-to-One

One to one relationship can be modeled one directional, or bidirectional.

The following properties are required;

- **joinOn**: the database table column name
- **model**: the name of the model the relationship points to.
- **foreignKey**: the foreignKey column name belonging to the other model / table. This is not stored on this model and table(!)
- **column**: represents the column name in the database of this table.
- **direction**: indicates the flow of "dependency", input means "depends on", output means "provides information". The output can be seen as the primary, the input side is the secondary side of the relationship.

To describe the Model **owning** the One-to-One relationship:

```typescript
export default class UserModel extends BaseAuthenticationModel {
    @OneToOne({ joinOn: ['id'], model: 'ProfileModel', column: 'profileId', direction: 'input' }) profile: ProfileModel;

    constructor(args: any) {
    }

    public setProfile(profile: ProfileModel) {
            this.profile = profile;
    }
}
``` 

To describe the Model that **does not own** the relationship:

```typescript
export default class ProfileModel extends BaseModel {
    @OneToOne({ joinOn: ['id'], model: 'ProfileModel', foreignKey: 'profileId', direction: 'output' }) user: UserModel;

    constructor(args: any) {
    }

    public setUser(user: UserModel) {
            this.user = user;
    }
}
```

the property `profileId` is stored on the User model in this example.

### One-to-Many

The properties for this relationship have the same meaning as the previous relationship `One-to-One`:

The **Many** side is described like this:

```typescript
export default class UserModel extends BaseAuthenticationModel {
    @OneToMany({ joinOn: ['userId'], model: 'PhotoModel', column: 'id', direction: 'output'}) photos: PhotoModel[];

    constructor(args: any) {
    }

    public setPhoto(photo: PhotoModel) {
        if(typeof this.photos === 'undefined') {
            this.photos = [];
        }

        this.photos.push(photo);	
    }
}
```

The **One** side is described like this:

```typescript
export default class PhotoModel extends BaseModel {
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId', direction: 'input' }) user: UserModel;

    constructor(args: any) {
    }

    public setUser(user: UserModel) {
       this.user = user;
    }
}
```

### Many-to-Many

For this relationship, an additional table will be created and because of that the naming of that table needs to be formalized in the properties:

The `owner` property determines the naming convention, if the `owner` property has value `user`, the many to many table name is `user-types-type`.

Example:

```typescript
export default class UserModel extends BaseAuthenticationModel {
    @ManyToMany({ model: 'TypeModel', column: 'id', owner: 'user' }) types: TypeModel[];

    constructor(args: any) {
    }

    public setType(type: TypeModel) {
		if(typeof this.types === 'undefined') {
			this.types = [];
		}

		this.types.push(type);
	}
}
```

```typescript
export default class TypeModel extends BaseModel {
    @ManyToMany({ model: 'UserModel', column: 'id', owner: 'user' }) users: UserModel[];
   
    constructor(args: any) {
    
    }

    public setUser(user: UserModel) {
        if(typeof this.users === 'undefined') {
		    this.users = [];
		}

        this.users.push(user);
    }
}
```

## Data Modeling Concepts: Direction and Relationships

### Overview

In data modeling, understanding the relationship between entities and the direction of data flow is crucial. This document outlines two key concepts: 'relationships' and 'direction', which are integral to designing and interpreting data models.

#### Example

Consider two entities: `UserModel` and `PhotosModel`. A `OneToMany` relationship from `UserModel` to `PhotosModel` suggests that a single user can have multiple photos.

```typescript
export default class UserModel extends BaseModel {
    // UserModel fields
}

export default class PhotosModel extends BaseModel {
     @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId', direction: 'input' }) user: UserModel; // foreignkey userId from user model.
}
```

### Direction

The 'direction' of a relationship indicates the operational or logical flow of data between entities, often in the context of application logic.

    input: Suggests that the entity is dependent on data from another entity. It 'takes in' information from its related entity.
    output: Implies that the entity provides or 'outputs' data to another entity. It often signifies a primary or independent entity in the relationship.

#### Example

Using the previous UserModel and PhotosModel example:

    If PhotosModel has an 'input' direction with UserModel, it indicates that a photo's creation depends on the existence of a user.
    Conversely, an 'output' direction in UserModel with respect to PhotosModel suggests that users are independent entities and can exist without associated photos.

```typescript
export default class class PhotosModel extends BaseModel {
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId', direction: 'input' }) user: UserModel; 
    // The direction here can be interpreted as 'input',
    // since PhotosModel depends on UserModel
}
```
#### Example with Contrasting Direction

In a situation where ClassModel is operationally dependent on StudentModel, despite a OneToMany structural relationship:

    If ClassModel has an 'input' direction with StudentModel, it means that the existence or creation of a class is dependent on students. For example, a class is only formed if there are enough students enrolled.
    This contrasts with the usual 'output' direction implied by a OneToMany relationship, where the 'one' side (ClassModel) would typically be the independent entity.

```typescript
export default class ClassModel extends BaseModel {
    // The direction here is 'input', contrary to the usual implication
    // of a OneToMany relationship. This implies operational dependence
    // on StudentModel.
}

export default class StudentModel extends BaseModel {
    @ManyToOne({ joinOn: ['id'], model: 'ClassModel', column: 'classId', direction: 'output' }) class: ClassModel;
    // Structurally, this is a OneToMany relationship from ClassModel to StudentModel.
}
```

##### Addressing the Paradox

To resolve this kind of paradox, you can consider a few approaches:

**Nullable Foreign Key:**

    Make the classId in StudentModel nullable. This allows students to exist without being assigned to a class initially. Once a ClassModel is created, students can be assigned to it.
    This approach reflects the operational reality that students can exist without a class but can later be associated with one.

```typescript

class StudentModel {
     @ManyToOne({ joinOn: ['id'], model: 'ClassModel', column: 'classId', direction: 'output'}) class: ClassModel;
    // Initially, classId can be null, allowing StudentModel to exist without a ClassModel.
}
```

**Two-Step Creation Process:**

    Implement a two-step creation process where students are first created without a class, and once a class is formed, they are updated with the classId.
    This requires an additional step in the data handling logic but can maintain the integrity of the relationship.

    Step 1: Create Student without classId
    Step 2: Once ClassModel is created, update StudentModel with classId
