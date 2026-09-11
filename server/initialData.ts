import { Source, Chunk, Flashcard, Quiz } from '../src/types';
import { globalVectorStore } from './vectorStore';

export const initialSources: Source[] = [
  {
    id: 'src-os-process-mgmt',
    title: 'Operating Systems — Process Management & Synchronization',
    type: 'pdf',
    createdAt: '2026-09-08T10:30:00.000Z',
    originalFilenameOrUrl: 'os_lecture_04_processes.pdf',
    processingStatus: 'processed',
    wordCount: 4820,
    estimatedReadingTime: 19,
    chunksCount: 6,
    tags: ['Operating Systems', 'Computer Science', 'Concurrency'],
    keyConcepts: [
      'Process Control Block (PCB)',
      'Context Switching',
      'Process States',
      'Race Conditions',
      'Critical Section Problem',
      'Peterson’s Solution',
      'Semaphores & Mutex',
      'Deadlock Conditions',
    ],
    summary: {
      overview:
        'A comprehensive study of OS process architecture, lifecycle states, scheduling mechanisms, and synchronization primitives required to prevent race conditions in concurrent execution.',
      executiveSummary:
        'Processes are active programs represented by PCBs. When multiple processes share memory or resources, synchronization mechanisms like semaphores and mutex locks must guarantee mutual exclusion, progress, and bounded waiting to prevent race conditions and deadlocks.',
      mainConcepts: [
        {
          concept: 'Process vs Program',
          explanation:
            'A program is passive code stored on disk, whereas a process is an active entity executing instructions with its own memory space (text, data, heap, stack).',
        },
        {
          concept: 'Process Control Block (PCB)',
          explanation:
            'A kernel data structure containing PID, Program Counter, CPU registers, scheduling priority, and I/O status required for context switching.',
        },
        {
          concept: 'Critical Section Problem',
          explanation:
            'A code segment where shared variables or resources are manipulated. Concurrent access without synchronization leads to non-deterministic race conditions.',
        },
        {
          concept: 'Semaphores (Counting & Binary)',
          explanation:
            'Synchronization tools with atomic wait() (P) and signal() (V) operations to control access to finite resources and critical sections.',
        },
      ],
      detailedExplanation:
        'Context switching is the mechanism where the CPU halts the execution of one process, saves its state into its PCB, and restores the state of another scheduled process. While essential for multitasking, context switching introduces pure overhead as no productive work occurs during the switch. Synchronization primitives like mutexes and Dijkstra semaphores coordinate concurrent threads to enforce Mutual Exclusion without busy-waiting (spinlock) when possible.',
      keyDefinitions: [
        {
          term: 'PCB (Process Control Block)',
          definition: 'Kernel data structure holding all contextual metadata for a single process.',
        },
        {
          term: 'Race Condition',
          definition:
            'A situation where multiple threads read and write shared data concurrently and the final result depends on the order of execution.',
        },
        {
          term: 'Mutual Exclusion',
          definition:
            'Requirement that only one process can execute in its critical section at any given point in time.',
        },
        {
          term: 'Deadlock',
          definition:
            'A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.',
        },
      ],
      importantFacts: [
        'Context switching overhead is determined by memory speeds, CPU register counts, and cache invalidation.',
        'Coffman conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
        'Binary semaphores are functionally equivalent to Mutex locks with integer values restricted to 0 and 1.',
      ],
      examples: [
        'Producer-Consumer problem with a bounded buffer using empty and full semaphores.',
        'Dining Philosophers problem illustrating circular wait deadlock scenarios.',
        'Readers-Writers problem where writers require exclusive access while readers share concurrent access.',
      ],
      relationships:
        'Process creation leads to scheduling in queues (Ready, Waiting, Terminated). Scheduling triggers context switches. Multiple scheduled processes sharing resources necessitate Synchronization primitives to protect Critical Sections.',
      importantQuestions: [
        'How does context switching impact system performance?',
        'What are the 3 essential criteria to solve the Critical Section problem?',
        'How does a counting semaphore differ from a binary mutex lock?',
        'What mechanisms can break the Circular Wait condition in deadlock prevention?',
      ],
      keyTakeaways: [
        'Always protect shared mutable state with atomic operations or locks.',
        'PCB saves program counter, registers, memory pointers, and open file descriptors.',
        'Critical section solutions must satisfy: Mutual Exclusion, Progress, and Bounded Waiting.',
      ],
      examFocus: [
        'Peterson’s Algorithm code and proof of mutual exclusion and progress.',
        'Producer-Consumer semaphore implementation with buffer size N.',
        'The four Coffman conditions for Deadlock.',
      ],
      difficultConcepts: [
        {
          concept: 'Priority Inversion',
          whyDifficult:
            'Occurs when a lower priority task holds a lock needed by a high priority task, but a medium priority task preempts the lower priority task.',
          studyTip:
            'Remember Priority Inheritance Protocol: elevate the low-priority lock-holder to the priority of the highest waiting process.',
        },
        {
          concept: 'Banker’s Algorithm for Deadlock Avoidance',
          whyDifficult: 'Tracking Available, Max, Allocation, and Need matrices across multiple resource instances.',
          studyTip: 'Practice finding a Safe Sequence step by step with pencil and paper.',
        },
      ],
      finalRevisionSummary:
        'Process = active program in memory. PCB stores state for context switching. Critical sections need Mutual Exclusion, Progress, Bounded Waiting. Use Semaphores (wait/signal) or Mutexes to avoid Race Conditions and Deadlocks.',
    },
  },
  {
    id: 'src-dbms-normalization',
    title: 'Database Systems — Relational Normalization & SQL',
    type: 'notes',
    createdAt: '2026-09-07T14:15:00.000Z',
    originalFilenameOrUrl: 'handwritten_dbms_lecture_notes.jpg',
    processingStatus: 'processed',
    wordCount: 3640,
    estimatedReadingTime: 14,
    chunksCount: 5,
    tags: ['Databases', 'DBMS', 'SQL', 'Normalization'],
    keyConcepts: [
      'Functional Dependency (FD)',
      '1st Normal Form (Atomic Attributes)',
      '2nd Normal Form (Partial Dependencies)',
      '3rd Normal Form (Transitive Dependencies)',
      'Boyce-Codd Normal Form (BCNF)',
      'Lossless Join Decomposition',
      'Dependency Preservation',
      'ACID Properties',
    ],
    summary: {
      overview:
        'A thorough guide to relational database design theory, focusing on functional dependencies, anomaly prevention (insertion, update, deletion), and progression from 1NF through BCNF.',
      executiveSummary:
        'Database normalization minimizes data redundancy and prevents update anomalies by decomposing unnormalized schemas into 1NF (atomic values), 2NF (no partial dependency on candidate keys), 3NF (no transitive dependency), and BCNF (every determinant is a candidate key).',
      mainConcepts: [
        {
          concept: 'First Normal Form (1NF)',
          explanation:
            'Enforces that domain values must be atomic (no multi-valued attributes or composite groups in any tuple).',
        },
        {
          concept: 'Second Normal Form (2NF)',
          explanation:
            'Must be in 1NF and contain no partial dependency: every non-prime attribute must be fully functionally dependent on the entire candidate key, not a subset.',
        },
        {
          concept: 'Third Normal Form (3NF)',
          explanation:
            'Must be in 2NF and contain no transitive dependency: for every non-trivial FD X -> Y, either X is a superkey or Y is a prime attribute.',
        },
        {
          concept: 'Boyce-Codd Normal Form (BCNF)',
          explanation:
            'Stricter than 3NF: for every non-trivial functional dependency X -> Y, X MUST be a superkey.',
        },
      ],
      detailedExplanation:
        'Poorly designed tables suffer from insertion anomalies (unable to add record without unrelated data), deletion anomalies (accidental loss of essential information when deleting another entity), and update anomalies (inconsistent duplicate updates). Normalization decomposes relations to isolate dependencies while preserving lossless join capability and functional dependencies.',
      keyDefinitions: [
        {
          term: 'Functional Dependency (X -> Y)',
          definition:
            'A constraint between two attributes where value of attribute X uniquely determines value of attribute Y in relation R.',
        },
        {
          term: 'Partial Dependency',
          definition:
            'When a non-prime attribute depends on only a proper subset of a composite candidate key.',
        },
        {
          term: 'Transitive Dependency (X -> Y and Y -> Z)',
          definition:
            'When a non-prime attribute Z depends on another non-prime attribute Y, which in turn depends on candidate key X.',
        },
        {
          term: 'Lossless Join',
          definition:
            'Decomposition of R into R1 and R2 where natural join of R1 and R2 reconstructs original relation R without phantom tuples.',
        },
      ],
      importantFacts: [
        '1NF eliminates repeating groups and composite attributes.',
        '2NF only applies when candidate keys are composite; if every candidate key is a single attribute, 1NF implies 2NF.',
        '3NF allows dependency preservation always, whereas BCNF decomposition cannot always preserve functional dependencies.',
      ],
      examples: [
        'Table StudentCourse(StudentID, CourseID, Instructor, InstructorRoom) decomposed into StudentCourse and CourseInstructor to reach 2NF/3NF.',
        'EmployeeProject table with composite key (EmpID, ProjectID) where EmpName depends solely on EmpID (partial dependency).',
      ],
      relationships:
        'Functional Dependencies determine Candidate Keys. Candidate Keys dictate which attributes are Prime vs Non-Prime. This defines Partial and Transitive dependencies for 2NF, 3NF, and BCNF.',
      importantQuestions: [
        'Why might BCNF decomposition cause loss of dependency preservation?',
        'How do you test if a relational decomposition is lossless join?',
        'What is Armstrong’s axioms and closure of an attribute set?',
      ],
      keyTakeaways: [
        'Normalization eliminates redundant data and guarantees database integrity.',
        '1NF = Atomic values. 2NF = Remove partial dependencies. 3NF = Remove transitive dependencies. BCNF = Determinant must be superkey.',
      ],
      examFocus: [
        'Finding minimal cover of functional dependencies.',
        'Testing decomposition for 3NF vs BCNF.',
        'Proving lossless join using Chase Test or intersection theorem (R1 ∩ R2 -> R1 or R2).',
      ],
      difficultConcepts: [
        {
          concept: 'BCNF vs 3NF Tradeoff',
          whyDifficult: 'Understanding why we sometimes settle for 3NF in enterprise production.',
          studyTip:
            'Remember: 3NF guarantees both Lossless Join AND Dependency Preservation. BCNF guarantees Lossless Join but may drop Dependency Preservation.',
        },
      ],
      finalRevisionSummary:
        'Normalization removes anomalies. 1NF = Atomic. 2NF = Full functional dependency (no partial key dependencies). 3NF = No transitive dependencies (X is superkey OR Y is prime). BCNF = Every determinant X is superkey.',
    },
  },
  {
    id: 'src-ml-neural-nets',
    title: 'Machine Learning — Deep Neural Networks & Backpropagation',
    type: 'video',
    createdAt: '2026-09-06T18:00:00.000Z',
    originalFilenameOrUrl: 'https://youtube.com/watch?v=deep_learning_backprop',
    processingStatus: 'processed',
    wordCount: 5210,
    estimatedReadingTime: 21,
    chunksCount: 6,
    tags: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'AI'],
    keyConcepts: [
      'Artificial Neurons (Perceptrons)',
      'Activation Functions (ReLU, Sigmoid, Softmax)',
      'Loss Functions (Cross-Entropy, MSE)',
      'Forward Propagation',
      'Computational Graphs',
      'Chain Rule of Calculus',
      'Backpropagation Algorithm',
      'Gradient Descent & Optimizers (Adam, SGD)',
      'Overfitting & Regularization (Dropout, L2)',
    ],
    videoChapters: [
      { timestamp: '00:00', title: 'Introduction to Artificial Neurons', summary: 'Foundations of linear combination and activation thresholds.' },
      { timestamp: '04:30', title: 'Activation Functions Compared', summary: 'Why non-linearity (ReLU vs Sigmoid) enables multi-layer universal approximation.' },
      { timestamp: '11:15', title: 'Loss Landscapes and Forward Pass', summary: 'Computing matrix dot products and categorical cross-entropy loss.' },
      { timestamp: '18:40', title: 'The Chain Rule and Backpropagation', summary: 'Deriving gradients of loss with respect to weights layer-by-layer backwards.' },
      { timestamp: '27:10', title: 'Modern Optimizers & Regularization', summary: 'Momentum, Adam, Dropout, and batch normalization techniques.' },
    ],
    summary: {
      overview:
        'An in-depth exploration of deep neural network architectures, matrix forward propagation, automatic differentiation via backpropagation, and optimization mechanics.',
      executiveSummary:
        'Neural networks learn hierarchical representations by updating weights through gradient descent. Backpropagation applies the multivariate calculus chain rule to calculate the partial derivative of the loss function with respect to every weight parameter, enabling efficient training of multi-layer architectures.',
      mainConcepts: [
        {
          concept: 'Activation Functions',
          explanation:
            'Non-linear functions applied element-wise (e.g. ReLU: max(0, x), Sigmoid: 1/(1+e^-x)) that allow neural networks to approximate arbitrary non-linear target functions.',
        },
        {
          concept: 'Forward Propagation',
          explanation:
            'Computing activations layer by layer: z^[l] = W^[l] * a^[l-1] + b^[l], followed by a^[l] = g^[l](z^[l]).',
        },
        {
          concept: 'Backpropagation',
          explanation:
            'Reverse computation of gradients using the chain rule: dL/dW^[l] = dL/da^[l] * da^[l]/dz^[l] * dz^[l]/dW^[l].',
        },
        {
          concept: 'Vanishing & Exploding Gradients',
          explanation:
            'In deep networks, gradients can shrink exponentially toward 0 (causing training to stall) or blow up to infinity when using saturating activations like sigmoid or improper initialization.',
        },
      ],
      detailedExplanation:
        'Without non-linear activations, stacking multiple dense layers collapses into a single linear transformation (W2 * W1 * x = W_combined * x). Modern networks universally adopt ReLU or GELU to avoid vanishing gradients in positive activations. Training minimizes empirical risk using optimizers like Adam which maintain running averages of both gradients (first moment) and squared gradients (second moment) with adaptive learning rates.',
      keyDefinitions: [
        {
          term: 'Perceptron',
          definition: 'Basic mathematical model of a biological neuron computing a weighted sum passed through an activation.',
        },
        {
          term: 'Loss Function',
          definition: 'A scalar metric quantifying prediction discrepancy on a single training example.',
        },
        {
          term: 'Cost Function',
          definition: 'Average loss across the entire training batch or dataset.',
        },
        {
          term: 'Learning Rate (alpha)',
          definition: 'Hyperparameter scaling the gradient step during weight parameter updates.',
        },
      ],
      importantFacts: [
        'ReLU has derivative 1 for positive inputs, eliminating gradient saturation for active neurons.',
        'Weight initialization must break symmetry (e.g., He or Xavier initialization) so neurons learn distinct features.',
        'Backpropagation has computational complexity proportional to the number of edges in the network computation graph.',
      ],
      examples: [
        'Image classification on MNIST using Conv2D feature extractors followed by Dense layers.',
        'Sentiment classification using embedding vectors with Cross-Entropy Loss.',
      ],
      relationships:
        'Forward pass calculates predictions and Loss. Loss initiates Backpropagation via Chain Rule to obtain gradients. Gradients feed Optimizer to adjust Weights. Epoch repeats until convergence.',
      importantQuestions: [
        'Why does Xavier initialization work well with tanh but poorly with ReLU?',
        'How does Dropout prevent co-adaptation of neurons during training?',
        'What is the difference between batch gradient descent, mini-batch GD, and stochastic GD?',
      ],
      keyTakeaways: [
        'Backprop is just the chain rule calculated backwards through the computational graph.',
        'Always normalize input features to prevent pathological loss landscapes.',
      ],
      examFocus: [
        'Deriving the gradient of Cross-Entropy with Softmax output.',
        'Computing numerical gradient checks.',
        'Explaining the mathematical mechanics of the Adam optimizer.',
      ],
      difficultConcepts: [
        {
          concept: 'Matrix Calculus in Backpropagation',
          whyDifficult: 'Keeping track of transpose dimensions (dL/dW = dz^[l] * (a^[l-1])^T).',
          studyTip: 'Dimension check: ensure the resulting gradient matrix has the exact same shape as weight matrix W.',
        },
      ],
      finalRevisionSummary:
        'Neural nets: z = W*x + b, a = g(z). Loss measures error. Backpropagation applies chain rule backwards to get dL/dW and dL/db. Optimizers step weights: W = W - alpha * dL/dW. ReLU prevents vanishing gradients.',
    },
  },
];

export const initialChunks: Chunk[] = [
  // OS chunks
  {
    id: 'chk-os-1',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    pageNumber: 2,
    sectionHeader: 'Process Concept & PCB Structure',
    content:
      'A process is an instance of an executing program consisting of text section (code), data section (global variables), heap (dynamic memory allocation), and stack (temporary local data, function parameters, return addresses). The operating system tracks each process via a Process Control Block (PCB). The PCB contains the Process Identification Number (PID), Process State (New, Ready, Running, Waiting, Terminated), Program Counter pointing to the next instruction, CPU Registers, Memory Management Information (base and limit registers or page tables), and Accounting and I/O status information.',
  },
  {
    id: 'chk-os-2',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    pageNumber: 5,
    sectionHeader: 'Context Switching & Scheduling Queues',
    content:
      'When the CPU switches to another process, the kernel must save the state of the old process into its PCB and load the saved state of the new process from its PCB. This operation is known as a Context Switch. Context switch time is pure computational overhead because the system does no useful user work during switching. The duration typically ranges from a few microseconds depending on hardware architecture, register sets, and cache invalidation.',
  },
  {
    id: 'chk-os-3',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    pageNumber: 11,
    sectionHeader: 'Critical Section Problem',
    content:
      'The Critical Section problem addresses concurrent access to shared resources. A race condition occurs when several processes access and manipulate the same data concurrently and the outcome of the execution depends on the particular order in which the access takes place. Any valid solution to the critical section problem must satisfy three strict requirements: 1. Mutual Exclusion (if process Pi is executing in its critical section, no other processes can be executing in their critical sections); 2. Progress (if no process is executing in its critical section and some processes wish to enter, selection cannot be postponed indefinitely); 3. Bounded Waiting (there must be a bound on the number of times that other processes are allowed to enter their critical sections after a process has made a request).',
  },
  {
    id: 'chk-os-4',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    pageNumber: 17,
    sectionHeader: 'Semaphores & Mutex Locks',
    content:
      'A semaphore S is a synchronization tool that provides an integer value accessed only through two standard atomic operations: wait() (originally P) and signal() (originally V). The wait operation decrements the semaphore value; if value becomes negative, the calling process is blocked and placed in the semaphore queue. The signal operation increments the semaphore value and unblocks a process if one is waiting. Counting semaphores control access to a finite number of resource instances, while binary semaphores (values 0 or 1) operate similarly to mutex locks providing mutual exclusion.',
  },
  {
    id: 'chk-os-5',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    pageNumber: 23,
    sectionHeader: 'Deadlock Conditions & Prevention',
    content:
      'A deadlock situation can arise if and only if four Coffman conditions hold simultaneously in a system: 1. Mutual Exclusion (at least one non-shareable resource); 2. Hold and Wait (a process must be holding at least one resource and waiting to acquire additional resources that are currently being held by other processes); 3. No Preemption (resources cannot be preempted; a resource can be released only voluntarily by the process holding it); 4. Circular Wait (a closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain). Deadlock prevention eliminates at least one condition, such as enforcing strict resource ordering to break Circular Wait.',
  },

  // DBMS chunks
  {
    id: 'chk-dbms-1',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    pageNumber: 1,
    sectionHeader: 'Functional Dependencies & Normal Forms Overview',
    content:
      'A Functional Dependency (FD) is a relationship between attributes denoted X -> Y, meaning that for any two tuples t1 and t2 in relation R, if t1[X] = t2[X], then t1[Y] must equal t2[Y]. Database normalization is the systematic process of organizing data in a database to reduce data redundancy and eliminate undesirable update, insertion, and deletion anomalies. An unnormalized table suffers from redundant data storage leading to inconsistency when one copy is updated while others remain unchanged.',
  },
  {
    id: 'chk-dbms-2',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    pageNumber: 3,
    sectionHeader: '1NF and 2NF (Partial Dependency)',
    content:
      'A relation is in First Normal Form (1NF) if and only if all attribute values are atomic; that is, no attribute contains multivalued sets or repeating composite groups. A relation is in Second Normal Form (2NF) if it is in 1NF and every non-prime attribute is fully functionally dependent on the primary key (no partial dependency). A partial dependency occurs when a non-prime attribute depends on only a proper subset of a composite candidate key. If the candidate key consists of a single attribute, the relation is automatically in 2NF once it satisfies 1NF.',
  },
  {
    id: 'chk-dbms-3',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    pageNumber: 6,
    sectionHeader: '3NF and Boyce-Codd Normal Form (BCNF)',
    content:
      'A relation is in Third Normal Form (3NF) if it is in 2NF and no non-prime attribute is transitively dependent on the primary key. Formally, for every non-trivial functional dependency X -> Y, either X is a superkey OR Y is a prime attribute (part of some candidate key). Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF that eliminates all redundancy based on functional dependencies: for every non-trivial functional dependency X -> Y, X MUST be a superkey. While every BCNF relation is in 3NF, not every 3NF relation is in BCNF. A decomposition into 3NF is always guaranteed to be both lossless join and dependency preserving, whereas BCNF decomposition guarantees lossless join but may fail to preserve all dependencies.',
  },

  // ML chunks
  {
    id: 'chk-ml-1',
    sourceId: 'src-ml-neural-nets',
    sourceTitle: 'Machine Learning — Deep Neural Networks & Backpropagation',
    timestamp: '04:30',
    sectionHeader: 'Activation Functions & Non-Linearity',
    content:
      'Activation functions introduce non-linearity into neural network computational graphs, empowering them to learn complex non-linear decision boundaries. Without non-linear activation functions, regardless of how many layers are stacked, the network is mathematically equivalent to a single linear regression model. Rectified Linear Unit (ReLU), defined as f(x) = max(0, x), is the standard activation for hidden layers because its derivative is 1 for positive inputs, avoiding vanishing gradients during backpropagation and promoting sparsity.',
  },
  {
    id: 'chk-ml-2',
    sourceId: 'src-ml-neural-nets',
    sourceTitle: 'Machine Learning — Deep Neural Networks & Backpropagation',
    timestamp: '18:40',
    sectionHeader: 'Backpropagation Algorithm and The Chain Rule',
    content:
      'Backpropagation is an efficient algorithm to calculate the gradient of the loss function with respect to every weight parameter in a neural network using the multivariate chain rule of calculus. In forward propagation, activations are computed layer by layer from inputs to outputs: z^[l] = W^[l] * a^[l-1] + b^[l], with a^[l] = g^[l](z^[l]). In the backward pass, error terms are propagated backwards from the output loss: dz^[l] = da^[l] ⊙ g^[l]\'(z^[l]), allowing exact calculation of dW^[l] = (1/m) * dz^[l] * (a^[l-1])^T and db^[l] = (1/m) * sum(dz^[l]). Parameters are updated along the negative gradient direction scaled by learning rate alpha.',
  },
];

export const initialFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    front: 'What are the 3 mandatory criteria for solving the Critical Section problem?',
    back: '1. Mutual Exclusion: Only one process in critical section at a time.\n2. Progress: If no process in critical section, waiting processes cannot be delayed indefinitely.\n3. Bounded Waiting: A limit exists on times other processes enter before a waiting process is granted access.',
    difficulty: 'medium',
    topic: 'Critical Section',
    status: 'learning',
  },
  {
    id: 'fc-2',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    front: 'What are the 4 Coffman conditions required for a Deadlock to occur?',
    back: '1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (holding a resource while waiting for another)\n3. No Preemption (resources cannot be forcibly taken)\n4. Circular Wait (a closed loop of waiting processes)',
    difficulty: 'hard',
    topic: 'Deadlocks',
    status: 'unseen',
  },
  {
    id: 'fc-3',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    front: 'What is the purpose of a Process Control Block (PCB)?',
    back: 'The PCB is the kernel data structure holding everything about a process needed for context switching: PID, Process State, Program Counter, CPU registers, CPU scheduling info, and I/O status.',
    difficulty: 'easy',
    topic: 'Process Architecture',
    status: 'mastered',
  },
  {
    id: 'fc-4',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    front: 'Which normal form removes Partial Dependencies, and what is a partial dependency?',
    back: 'Second Normal Form (2NF) removes partial dependencies.\nA partial dependency occurs when a non-prime attribute depends on only part of a composite candidate key rather than the entire key.',
    difficulty: 'medium',
    topic: '2NF Normalization',
    status: 'learning',
  },
  {
    id: 'fc-5',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    front: 'What is the key difference between 3NF and BCNF?',
    back: 'In 3NF, for every non-trivial FD X -> Y, X is a superkey OR Y is a prime attribute.\nIn BCNF, X MUST be a superkey (no exception for prime attributes). BCNF is stricter but may lose dependency preservation.',
    difficulty: 'hard',
    topic: 'BCNF Normalization',
    status: 'difficult',
  },
  {
    id: 'fc-6',
    sourceId: 'src-ml-neural-nets',
    sourceTitle: 'Machine Learning — Deep Neural Networks & Backpropagation',
    front: 'Why is ReLU preferred over Sigmoid in deep hidden layers?',
    back: 'ReLU (max(0, x)) has a constant gradient of 1 for positive inputs, avoiding the vanishing gradient problem that plagues Sigmoid (where gradients saturate near 0 for large positive/negative values). It is also computationally faster.',
    difficulty: 'easy',
    topic: 'Activation Functions',
    status: 'mastered',
  },
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-os-1',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    title: 'Process Management & Synchronization Mastery Test',
    topic: 'Operating Systems',
    difficulty: 'medium',
    createdAt: '2026-09-08T11:00:00.000Z',
    questions: [
      {
        id: 'q-os-1',
        type: 'mcq',
        question: 'Which of the following is NOT one of the three requirements to solve the critical section problem?',
        options: [
          'Mutual Exclusion',
          'Bounded Waiting',
          'Starvation Freedom via Priority Inversion',
          'Progress',
        ],
        correctAnswer: 'Starvation Freedom via Priority Inversion',
        explanation:
          'The three formal requirements for the critical section problem defined by Dijkstra are Mutual Exclusion, Progress, and Bounded Waiting.',
        sourceCitation: 'PDF Page 11 — Section: Critical Section Problem',
        topic: 'Critical Section',
      },
      {
        id: 'q-os-2',
        type: 'mcq',
        question: 'What is the primary performance overhead associated with Context Switching?',
        options: [
          'Disk defragmentation',
          'Saving and restoring PCB registers and CPU cache invalidation without productive user execution',
          'Allocating new IP addresses',
          'Recompiling application bytecodes',
        ],
        correctAnswer: 'Saving and restoring PCB registers and CPU cache invalidation without productive user execution',
        explanation:
          'Context switching is pure overhead: the CPU stops executing user code to store old register states into the PCB and load new states, invalidating CPU caches.',
        sourceCitation: 'PDF Page 5 — Section: Context Switching & Scheduling Queues',
        topic: 'Context Switching',
      },
      {
        id: 'q-os-3',
        type: 'true_false',
        question: 'A counting semaphore with an initial value of 5 can allow at most 5 concurrent processes to enter before blocking further callers.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'Each wait() call decrements the semaphore counter. When it reaches 0, the next wait() call sets it negative and blocks the caller, successfully limiting access to 5 instances.',
        sourceCitation: 'PDF Page 17 — Section: Semaphores & Mutex Locks',
        topic: 'Semaphores',
      },
      {
        id: 'q-os-4',
        type: 'short_answer',
        question: 'Name the condition where a low-priority task holds a lock needed by a high-priority task, while an intermediate medium-priority task preempts the low-priority task.',
        correctAnswer: 'Priority Inversion',
        explanation:
          'Priority inversion is solved in real-time operating systems using Priority Inheritance protocols.',
        sourceCitation: 'PDF Page 19 — Difficult Concepts',
        topic: 'Priority Inversion',
      },
    ],
  },
  {
    id: 'quiz-dbms-1',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    title: 'Relational Normalization Assessment',
    topic: 'Database Systems',
    difficulty: 'hard',
    createdAt: '2026-09-07T15:00:00.000Z',
    questions: [
      {
        id: 'q-db-1',
        type: 'mcq',
        question: 'Which normal form guarantees the removal of Partial Dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: '2NF',
        explanation:
          '2NF requires the relation to be in 1NF and enforces that no non-prime attribute depends on a proper subset of any candidate key.',
        sourceCitation: 'Notes Page 3 — Section: 1NF and 2NF (Partial Dependency)',
        topic: '2NF Normalization',
      },
      {
        id: 'q-db-2',
        type: 'mcq',
        question: 'Under what condition does a decomposition to BCNF differ from 3NF?',
        options: [
          'BCNF allows multi-valued attributes',
          'In 3NF, the dependent attribute Y can be prime even if determinant X is not a superkey; BCNF strictly requires X to be a superkey',
          '3NF prohibits atomic values',
          'BCNF always preserves all functional dependencies',
        ],
        correctAnswer: 'In 3NF, the dependent attribute Y can be prime even if determinant X is not a superkey; BCNF strictly requires X to be a superkey',
        explanation:
          'In 3NF, for X -> Y, either X is a superkey OR Y is prime. BCNF removes the "Y is prime" escape hatch, making every determinant a superkey.',
        sourceCitation: 'Notes Page 6 — Section: 3NF and Boyce-Codd Normal Form (BCNF)',
        topic: 'BCNF vs 3NF',
      },
      {
        id: 'q-db-3',
        type: 'true_false',
        question: 'If every candidate key of a 1NF relation consists of only a single attribute, the relation is automatically in 2NF.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'Partial dependency requires a proper subset of a composite candidate key. A single-attribute key has no non-empty proper subsets.',
        sourceCitation: 'Notes Page 3 — Section: 1NF and 2NF',
        topic: '2NF Rules',
      },
    ],
  },
];

// Initialize global vector store with embeddings for initial chunks
export function populateInitialData() {
  for (const chunk of initialChunks) {
    if (!chunk.embedding || chunk.embedding.length === 0) {
      chunk.embedding = globalVectorStore.generateLocalEmbedding(chunk.content);
    }
  }
  globalVectorStore.addChunks(initialChunks);
}
